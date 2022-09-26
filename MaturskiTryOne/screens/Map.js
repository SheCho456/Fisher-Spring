import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Modal,
    Image,
    TouchableOpacity,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MarkerData from './FishingSpots';
import MapViewDirections from 'react-native-maps-directions';

const initialState ={ 
    latitude: 43.856430,
    longitude: 18.413029,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
}

export default function MapInitial() {
   const [currentPosition, setCurrentPosition] = useState(initialState);
   const [currentCamera, setCurrentCamera] = useState(initialState);
   const [modalVisible, setModalVisible] = useState(false);
   const [modalTexts, setModalTexsts] = useState(true);
   const [modalInfo, setModalInfo] = useState({
    id: 1,
    title: "Revir na rijeci Krušnici",
    latitude: 0,
    longitude: 0,
    description: "PRVA DESKRIPCIJA",
    image: "Slika_1.png",
    modDescription: 'Placeholder',
    types: 'Placeholder',
    modDetails: {
      fishTypes: 'Placeholder',
      locationMod:'Placeholder',
      fishingType: 'Placeholder',
      waterType: 'Placeholder',
      license: 'Placeholder',
    }
   });
   const [trueDestination, setTrueDestination] = useState({
     latitude: 0,
     longitude: 0,
     isOrIsNot: false
   })
   
   const directionOrigin = {
     latitude: currentPosition.latitude,
     longitude: currentPosition.longitude
    }
   
   const directionDestination = {
     latitude: trueDestination.latitude,
     longitude: trueDestination.longitude
   }
   
   const markeri = MarkerData.map(marker => {
    return(
        <Marker
        key={marker.id}
        title={marker.title}
        coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
        }}
        backgroundColor={'#000000'}
        onPress={()=>{
          setModalVisible(true)
          setModalInfo({
            id: marker.id,
            title: marker.title,
            latitude: marker.latitude,
            longitude: marker.longitude,
            description: marker.description,
            image: marker.image,
            modDescription: marker.modDescription,
            modTypes: marker.types,
            modDetails: {
              fishTypes: marker.details.fishTypes,
              locationMod: marker.details.locationMod,
              fishingType: marker.details.fishingType,
              waterType: marker.details.waterType,
              license: marker.details.license,
              idealTime: marker.details.idealTime
            }
          })
          let newLocation={
            latitude: marker.latitude,
            longitude: marker.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }
          setCurrentCamera(newLocation)
        }}
        >
        </Marker>
    )
    })

    function LoadImage(ide) {
    switch(ide){
      case 1:
        return require('./images/Slika_1.png');
      case 2:
        return require('./images/Slika_2.png');
      case 3: 
        return require('./images/Slika_3.png');
      case 4:
        return require('./images/Slika_4.png');
      case 5:
        return require('./images/Slika_5.png');
      case 6:
        return require('./images/Slika_6.png');
      case 7:
        return require('./images/Slika_7.png');
      case 8:
        return require('./images/Slika_8.png');
      case 9:
        return require('./images/Slika_9.png');
      case 10:
        return require('./images/Slika_10.png');  
    }
    }
     
   function ModalWindow(){
     return(
      <Modal
    animationType="slide"
    visible={modalVisible}
    presentationStyle="formSheet"
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
    >
    <Image
      source={LoadImage(modalInfo.id)}
      style={styles.modalImage}
    ></Image>
    <Text
      style={styles.modalTitle}
    >{modalInfo.title}</Text>
    <View style={styles.modalButtonContainer}>
        <TouchableOpacity style={styles.modalButtons} onPress={()=>{
          setModalTexsts(true)
        }}>
          <Text style={styles.modalButtonText}>O lokaciji</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButtons} onPress={()=>{
          setModalTexsts(false)
        }}>
          <Text style={styles.modalButtonText}>Detalji</Text>
        </TouchableOpacity>
    </View>
    {modalTexts ? 
    <Text style={styles.modalDescription}>{modalInfo.modDescription}</Text>:
    <View style={styles.modalDescription}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Vrste riba:
        <Text style={{fontWeight: '100', fontSize: 17}}> {modalInfo.modDetails.fishTypes}</Text>
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Lokacija:
        <Text style={{fontWeight: '100', fontSize: 17}}> {modalInfo.modDetails.locationMod}</Text>
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Tip pecanja:
        <Text style={{fontWeight: '100', fontSize: 17}}> {modalInfo.modDetails.fishingType}</Text>
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Tip vode:
        <Text style={{fontWeight: '100', fontSize: 17}}> {modalInfo.modDetails.waterType}</Text>
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Dozvola:
        <Text style={{fontWeight: '100', fontSize: 17}}> {modalInfo.modDetails.license}</Text>
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Idealno vrijeme:
        <Text style={{fontWeight: '100', fontSize: 17}}> {modalInfo.modDetails.idealTime}</Text>
      </Text>
    </View>
    }
    <View style={styles.modalButtonContainer}>
        <TouchableOpacity style={styles.modalOptions} onPress={()=>{
          setModalVisible(false)
        }}>
          <Text style={styles.modalButtonText}>Zatvori</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalOptions} onPress={()=>{
          setTrueDestination({
            latitude: modalInfo.latitude,
            longitude: modalInfo.longitude,
            isOrIsNot: !trueDestination.isOrIsNot
          })
        }}>
          {trueDestination.isOrIsNot ? 
          <Text style={styles.modalButtonText}>Prestani pratiti</Text> : 
          <Text style={styles.modalButtonText}>Počni pratiti</Text>}
        </TouchableOpacity>
    </View>
    </Modal>
     )
   }

   useEffect(() => {
       Geolocation.getCurrentPosition(position => {
           setCurrentPosition({
            ...currentPosition,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }); 
           setCurrentCamera({
            ...currentPosition,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }),
        error =>{
            alert(error);
        },
        {highAccuracy: true, maximumAge: 5000}
       }, );      
   }, [])

  

      return (
       <View style={styles.body}>
       <MapView
        style={styles.map}
        mapType={'hybrid'}
        toolbarEnabled={false}
        loadingEnabled={true}
        loadingBackgroundColor={"#5fd47a"}
        region={{
        latitude: currentCamera.latitude,
        longitude: currentCamera.longitude,
        latitudeDelta: currentCamera.latitudeDelta,
        longitudeDelta: currentCamera.longitudeDelta,
        }}
        >
        {trueDestination.isOrIsNot ? <MapViewDirections
        origin={directionOrigin}
        destination={directionDestination} 
        apikey={'AIzaSyBtHvy-1UCWvrNTIeysZ_jnIIZIQuZrvHk'}
        strokeWidth={3}
        strokeColor='yellow'
        /> :
        <MapViewDirections
        origin={directionOrigin}
        destination={directionDestination} 
        apikey={'AIzaSyBtHvy-1UCWvrNTIeysZ_jnIIZIQuZrvHk'}
        strokeWidth={0}
        strokeColor='yellow'
        />
      }
        <Marker 
        coordinate={{
        longitude: currentPosition.longitude, 
        latitude: currentPosition.latitude,
        }}
        title={"Vi"}
        ></Marker>
        {markeri}
    </MapView>
    {ModalWindow()}
       </View>  
   )
}

const styles =  StyleSheet.create({
  modalOptions: {
    width: '44%',
    height: '100%',
    backgroundColor: 'lightblue',
    borderWidth: 1.5,
    borderColor: 'darkred',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 15,
    marginTop: 20
  },
  modalDescription: {
    backgroundColor: 'beige',
    width: '100%',
    height: '41%',
    top: '1.5%',
    fontSize: 17,
    paddingLeft: '4%',
    paddingTop: '2%',
    textAlign: 'left',
  },
  modalButtonText: {
    fontSize: 18,
  },
  modalButtons: {
    width: '50%',
    height: '100%',
    backgroundColor: 'lightgreen',
    borderWidth: 1.5,
    borderColor: 'darkred',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    height: '7%',
    top: "2%"
  },
  modalTitle: {
    fontSize: 22,
    textAlign: 'center',
    top: "0.5%",
    color: 'black',
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: '30%',
  },
  body: {
      flex: 1,
      alignItems: 'center',
  },
  map: {
      width: '100%',
      height: '100%'
  },
  restartButton: {
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 10,
  },
  restartView: {
    position: 'absolute',
    top: '90%',
    alignSelf: 'flex-end',
    right: '5%'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: "center"
  }
})