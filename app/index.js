/**
 * @format
 */
import  { Component } from 'react'
import globe from './globe'
import { AppRegistry, Alert } from 'react-native';
import { name as appName } from './app.json';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import Main from './Components/Main'
import Setting from './Components/Setting'
import NewNote from './Components/NewNote'
import EditedNote from './Components/EditedNote'
import ResetPassword from './Components/ResetPassword';
import network from "./API/networking"
class home extends Component {
    componentDidMount() {
        AsyncStorage.multiGet(["logIn","setting"], (error, [result,setting]) => {
            result = result[1]
            try{
                globe.theme = JSON.parse(setting[1]).theme
            }catch(e){
                AsyncStorage.setItem("setting",'{"theme":"light"}')
            }
            if (result !== null && !error) {
                if (result == 1) {
                    globe.login = 1;
                    this.props.navigation.replace("main");
                } else {
                    result = JSON.parse(result)
                    globe.login = result
                    network(`/check?id=${result.id}`, "GET", [], (err, data) => {
                        if (err || data.ans == 0) {
                            Alert.alert("Error", "login session timeout please login again")
                            this.props.navigation.replace("login")
                            AsyncStorage.multiRemove(["logIn", "note"])
                        } else {
                            this.props.navigation.replace("main");

                        }
                    })
                }
            } else {
                this.props.navigation.replace("login");
            }
        })
    }
    render() { return (null)}
}

const App = createStackNavigator({
    Home: { screen: home },
    login: { screen: Login },
    signUp: { screen: SignUp },
    main: { screen: Main },
    setting: { screen: Setting },
    newNote: { screen: NewNote },
    editedNote: { screen: EditedNote },
    resetPassword: { screen: ResetPassword }
},
{
  headerMode: 'none',
  transparentCard: true
})
AppRegistry.registerComponent(appName, () => createAppContainer(App));
