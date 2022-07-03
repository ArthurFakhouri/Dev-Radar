import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs, unsubscribeDev } from '../services/socket';

function Main({ navigation }) {

    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestForegroundPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync();
                const { latitude, longitude } = coords;

                setCurrentRegion({ latitude, longitude, latitudeDelta: 0.04, longitudeDelta: 0.04, });
            }
        }
        loadInitialPosition();
    }, [])

    useEffect(()=> {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
        unsubscribeDev(github_username => setDevs(devs.filter(dev => dev.github_username !== github_username)));
    }, [devs]);

    function setupWebsocket() {
        disconnect();

        const {latitude, longitude} = currentRegion;

        connect(latitude, longitude, techs);
    }

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const res = await api.get('/search', { params: { latitude, longitude, techs: techs } });

        setDevs(res.data.dev);
        setupWebsocket();
    }

    if (!currentRegion) {
        return null;
    }

    function handleRegionChanged(region) {
        setCurrentRegion(region);
    }

    function handleNavigate(github_username) {
        navigation.navigate('Profile', { github_username: github_username });
    }

    function handleSubmit() {
        loadDevs();
    }

    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChanged} style={styles.map} initialRegion={currentRegion}>
                {devs.map(dev => (
                    <Marker key={dev._id} coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}>
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
                        <Callout onPress={() => handleNavigate(dev.github_username)}>
                            <View style={styles.callout}>
                                <Text style={styles.name}>{dev.name}</Text>
                                <Text style={styles.bio}>{dev.bio}</Text>
                                <Text style={styles.techs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput style={styles.searchInput}
                    placeholder="Buscar devs por techs..." placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs} onChangeText={setTechs} />
                <TouchableOpacity onPress={handleSubmit} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    bio: {
        color: '#666',
        marginTop: 5
    },
    techs: {
        marginTop: 5
    },
    searchForm: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: .2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    }
});

export default Main;