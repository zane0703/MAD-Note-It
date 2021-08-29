import React from 'react';
import globe from '../globe'
import {
    StyleSheet,
    Image,
    Button,
    Text,
    View,
    TextInput,
    BackHandler,
    Alert,
    Modal,
    ScrollView,
    StatusBar,
} from 'react-native';
import network from "../API/networking"
import AsyncStorage from '@react-native-community/async-storage';
const style = {
    dark: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#000000',
            height: "100%"
        }, textInput: {
            color: "#ffffff",
            borderBottomColor: "#ffffff"
        }
    }),
    light: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#ffffff',
            height: "100%"
        }, textInput: {
            color: "#000000",
            borderBottomColor: "#000000"
        }
    }),
    layOut: StyleSheet.create({
        textInput: {
            alignSelf: "center"
            , width: "80%"
            , borderBottomWidth: 0.5
        },
        text: {

            alignSelf: "center",
            fontSize: 25,
            fontFamily: "Roboto",
            marginTop: 10,
            color: "#808080",
            fontWeight:"bold",

        }
    })
}
export default class Login extends React.Component {
    state = { theme: globe.theme, errMassage: null, modalVisible: false, email: "", userName: "", password: "" }
    static navigationOptions = {
        header: null
    };
    isValidEmail(inputValue) {
        let atPos = inputValue.indexOf("@");
        let dotPos = inputValue.lastIndexOf(".");
        let isValid = (atPos > 0) && (dotPos > atPos + 1) && (inputValue.length > dotPos + 2);
        if (isValid) { this.setState({ modalVisible: false }); this.props.navigation.navigate("resetPassword") }
        else { this.setState({ errMassage: "please enter correct email address" }) };
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._closeApp)
        this.setState(({theme})=>({image:theme == "dark" ? require("../Images/darkLogo.png") : require("../Images/lightLogo.png")}))
    }
    componentWillUnmount() {
        this.backHandler.remove()

    }

    _closeApp() {

        Alert.alert(
            "Exit App",
            "Do you want to exit?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                { text: "Yes", onPress: BackHandler.exitApp}
            ],
            { cancelable: true }
        );
        return true

    }
    login = () => {
        let body = {username:this.state.userName.toLocaleUpperCase(),password:this.state.password}
        AsyncStorage.getItem("note",(err,data)=>{
            if (!err && data != null && data !=undefined){
            body.oldNote = JSON.parse(data)
            }
            network("/login","POST",body,(err,data,status)=>{
                if(err!=null){ Alert.alert("Error",err.bodyString?err.bodyString:"unknown error") }
                else{
                    if(status === 200){
                        globe.login = data
                        AsyncStorage.setItem("logIn",JSON.stringify(data),(err)=>{
                            if (!err){
                                this.props.navigation.replace("main");
                            }
                        })
                    }
                }

            })
        })
    }
    render() {
        const { navigate, replace } = this.props.navigation;
        return (
            <ScrollView style={[style[this.state.theme].ViewStyle]}>
                <StatusBar backgroundColor={this.state.theme==="dark"?"black":"white"} barStyle={this.state.theme==="dark"?"light-content":"dark-content"} />
                <Image source={this.state.image}  style={{width:"100%"}} resizeMode="contain" />
                <TextInput returnKeyType="next" autoCompleteType="username" value={this.state.userName} onChangeText={(userName) => this.setState({ userName })} placeholder="Username" placeholderTextColor="#505050" style={[style[this.state.theme].textInput, style.layOut.textInput]} onSubmitEditing={()=>this.secondTextInput.focus()} />
                <TextInput returnKeyType="done" autoCompleteType="password" value={this.state.password} onChangeText={(password) => this.setState({ password })} placeholder="Password" placeholderTextColor="#505050" style={[style[this.state.theme].textInput, style.layOut.textInput]} secureTextEntry={true} onSubmitEditing={this.login}  ref={(input) => { this.secondTextInput = input; }}/>
                <View style={{ alignSelf: "center", flexDirection: "column", marginTop: 20 }}>
                    <Button title="Login" color="#505050" onPress={this.login} />
                </View>
                <View style={{ alignSelf: "center", flexDirection: "column", marginTop: 10 }}>
                    <Button title="Skip Registration/Login" color="#009900" onPress={() => {globe.login ="1"; AsyncStorage.setItem("logIn", "1", () => replace("main")) }} />
                </View>
                <Text style={style.layOut.text}>New to Note-It?</Text>
                <View style={{ alignSelf: "center", flexDirection: "column" }}>
                    <Button onPress={() => { navigate("signUp") }} title="Sign Up Now!" color="#505050" />
                </View>
                <Text style={[style.layOut.text, { marginTop: 10 }]}>Forgot Your Password?</Text>
                <View style={{ alignSelf: "center", flexDirection: "column" }}>
                    <Button onPress={() => this.setState({ modalVisible: true })} title="Reset Password" color="#505050" />
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={[style[this.state.theme].ViewStyle, {
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 200,
                            width: '90%',
                            borderWidth: 1,
                            borderColor: '#505050',
                            borderRadius: 7,
                        }]}>
                            <Text style={style.layOut.text}>Forgotten Your Password?</Text>
                            <Text style={{ color: "#ff0000" }}>{this.state.errMassage}</Text>
                            <TextInput autoFocus={true} style={[style[this.state.theme].textInput, style.layOut.textInput]} autoCompleteType="email" placeholder="Enter Your Registered Email" placeholderTextColor="#505050" onChangeText={email => { this.setState({ email,errMassage:null }) }} style={[style[this.state.theme].textInput, style.layOut.textInput]} />
                            <View style={{ flexDirection: "row", width: "80%", justifyContent: 'space-between', alignSelf: "center", marginTop: 10 }}>
                                <Button title="Cancel" color="#505050" onPress={() => this.setState({ modalVisible: false })} />
                                <Button title="submit" color="#505050" onPress={() => this.isValidEmail(this.state.email)} />
                            </View>

                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}