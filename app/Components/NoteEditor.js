import React from 'react';
import globe from '../globe'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Picker,
    TouchableHighlight,
    Modal,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { TriangleColorPicker } from 'react-native-color-picker'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { faFont, faFillDrip } from '@fortawesome/free-solid-svg-icons'
const style = {
    dark: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#000000',
            height: "100%"
        },
        text: { color: "#ffffff", borderBottomColor: "#ffffff" }
    }),
    light: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#ffffff',
            height: "100%"
        },
        text: { color: "#000000", borderBottomColor: "#000000" }
    }),
    layOut: StyleSheet.create({
        textInput: {
            alignSelf: "center"
            , width: "80%"
            , borderBottomWidth: 0.5
        },
        text: {
            color: "#808080",
            alignSelf: "center",
            fontSize: 20,
            fontFamily: "Roboto",
            marginTop: 10
        }, fontBu: { fontWeight: "bold", fontSize: 20, paddingRight: 5, height: 25, paddingLeft: 5, }
    })
}

const fontList = Platform.select({
    android: [<Picker.Item key={0} label="Normal" value="normal" />,
    <Picker.Item key={0} label="Notoserif" value="notoserif" />,
    <Picker.Item key={1} label="Sans serif" value="sans-serif" />,
    <Picker.Item key={2} label="Sans serif light" value="sans-serif-light" />,
    <Picker.Item key={3} label="Sans serif thin" value="sans-serif-thin" />,
    <Picker.Item key={4} label="Sans serif condensed" value="sans-serif-medium" />,
    <Picker.Item key={5} label="Serif" value="serif" />,
    <Picker.Item key={6} label="Roboto" value="Roboto" />,
    <Picker.Item key={7} label="Monospace" value="monospace" />],
    ios: [<Picker.Item key={0} label="San Francisco" value="San Francisco" />,
    <Picker.Item key={1} label="Academy Engraved LET" value="Academy Engraved LET" />,
    <Picker.Item key={2} label="AcademyEngravedLetPlain" value="AcademyEngravedLetPlain" />,
    <Picker.Item key={3} label="Al Nile" value="Al Nile" />,
    <Picker.Item key={4} label="AlNile-Bold" value="AlNile-Bold" />,
    <Picker.Item key={5} label="American Typewriter" value="American Typewriter" />,
    <Picker.Item key={6} label="AmericanTypewriter-Bold" value="AmericanTypewriter-Bold" />,
    <Picker.Item key={7} label="AmericanTypewriter-Condensed" value="AmericanTypewriter-Condensed" />,
    <Picker.Item key={8} label="AmericanTypewriter-CondensedBold" value="AmericanTypewriter-CondensedBold" />,
    <Picker.Item key={9} label="AmericanTypewriter-CondensedLight" value="AmericanTypewriter-CondensedLight" />,
    <Picker.Item key={10} label="AmericanTypewriter-Light" value="AmericanTypewriter-Light" />,
    <Picker.Item key={11} label="Apple Color Emoji" value="Apple Color Emoji" />,
    <Picker.Item key={12} label="Apple SD Gothic Neo" value="Apple SD Gothic Neo" />,
    <Picker.Item key={13} label="AppleColorEmoji" value="AppleColorEmoji" />,
    <Picker.Item key={14} label="AppleSDGothicNeo-Bold" value="AppleSDGothicNeo-Bold" />,
    <Picker.Item key={15} label="AppleSDGothicNeo-Light" value="AppleSDGothicNeo-Light" />,
    <Picker.Item key={16} label="AppleSDGothicNeo-Medium" value="AppleSDGothicNeo-Medium" />,
    <Picker.Item key={17} label="AppleSDGothicNeo-Regular" value="AppleSDGothicNeo-Regular" />,
    <Picker.Item key={18} label="AppleSDGothicNeo-SemiBold" value="AppleSDGothicNeo-SemiBold" />,
    <Picker.Item key={19} label="AppleSDGothicNeo-Thin" value="AppleSDGothicNeo-Thin" />,
    <Picker.Item key={20} label="AppleSDGothicNeo-UltraLight" value="AppleSDGothicNeo-UltraLight" />,
    <Picker.Item key={21} label="Arial" value="Arial" />,
    <Picker.Item key={22} label="Arial Hebrew" value="Arial Hebrew" />,
    <Picker.Item key={23} label="Arial Rounded MT Bold" value="Arial Rounded MT Bold" />,
    <Picker.Item key={24} label="Arial-BoldItalicMT" value="Arial-BoldItalicMT" />,
    <Picker.Item key={25} label="Arial-BoldMT" value="Arial-BoldMT" />,
    <Picker.Item key={26} label="Arial-ItalicMT" value="Arial-ItalicMT" />,
    <Picker.Item key={27} label="ArialHebrew" value="ArialHebrew" />,
    <Picker.Item key={28} label="ArialHebrew-Bold" value="ArialHebrew-Bold" />,
    <Picker.Item key={29} label="ArialHebrew-Light" value="ArialHebrew-Light" />,
    <Picker.Item key={30} label="ArialMT" value="ArialMT" />,
    <Picker.Item key={31} label="ArialRoundedMTBold" value="ArialRoundedMTBold" />,
    <Picker.Item key={32} label="Avenir" value="Avenir" />,
    <Picker.Item key={33} label="Avenir Next" value="Avenir Next" />,
    <Picker.Item key={34} label="Avenir Next Condensed" value="Avenir Next Condensed" />,
    <Picker.Item key={35} label="Avenir-Black" value="Avenir-Black" />,
    <Picker.Item key={36} label="Avenir-BlackOblique" value="Avenir-BlackOblique" />,
    <Picker.Item key={37} label="Avenir-Book" value="Avenir-Book" />,
    <Picker.Item key={38} label="Avenir-BookOblique" value="Avenir-BookOblique" />,
    <Picker.Item key={39} label="Avenir-Heavy" value="Avenir-Heavy" />,
    <Picker.Item key={40} label="Avenir-HeavyOblique" value="Avenir-HeavyOblique" />,
    <Picker.Item key={41} label="Avenir-Light" value="Avenir-Light" />,
    <Picker.Item key={42} label="Avenir-LightOblique" value="Avenir-LightOblique" />,
    <Picker.Item key={43} label="Avenir-Medium" value="Avenir-Medium" />,
    <Picker.Item key={44} label="Avenir-MediumOblique" value="Avenir-MediumOblique" />,
    <Picker.Item key={45} label="Avenir-Oblique" value="Avenir-Oblique" />,
    <Picker.Item key={46} label="Avenir-Roman" value="Avenir-Roman" />,
    <Picker.Item key={47} label="AvenirNext-Bold" value="AvenirNext-Bold" />,
    <Picker.Item key={48} label="AvenirNext-BoldItalic" value="AvenirNext-BoldItalic" />,
    <Picker.Item key={49} label="AvenirNext-DemiBold" value="AvenirNext-DemiBold" />,
    <Picker.Item key={50} label="AvenirNext-DemiBoldItalic" value="AvenirNext-DemiBoldItalic" />,
    <Picker.Item key={51} label="AvenirNext-Heavy" value="AvenirNext-Heavy" />,
    <Picker.Item key={52} label="AvenirNext-HeavyItalic" value="AvenirNext-HeavyItalic" />,
    <Picker.Item key={53} label="AvenirNext-Italic" value="AvenirNext-Italic" />,
    <Picker.Item key={54} label="AvenirNext-Medium" value="AvenirNext-Medium" />,
    <Picker.Item key={55} label="AvenirNext-MediumItalic" value="AvenirNext-MediumItalic" />,
    <Picker.Item key={56} label="AvenirNext-Regular" value="AvenirNext-Regular" />,
    <Picker.Item key={57} label="AvenirNext-UltraLight" value="AvenirNext-UltraLight" />,
    <Picker.Item key={58} label="AvenirNext-UltraLightItalic" value="AvenirNext-UltraLightItalic" />,
    <Picker.Item key={59} label="AvenirNextCondensed-Bold" value="AvenirNextCondensed-Bold" />,
    <Picker.Item key={60} label="AvenirNextCondensed-BoldItalic" value="AvenirNextCondensed-BoldItalic" />,
    <Picker.Item key={61} label="AvenirNextCondensed-DemiBold" value="AvenirNextCondensed-DemiBold" />,
    <Picker.Item key={62} label="AvenirNextCondensed-DemiBoldItalic" value="AvenirNextCondensed-DemiBoldItalic" />,
    <Picker.Item key={63} label="AvenirNextCondensed-Heavy" value="AvenirNextCondensed-Heavy" />,
    <Picker.Item key={64} label="AvenirNextCondensed-HeavyItalic" value="AvenirNextCondensed-HeavyItalic" />,
    <Picker.Item key={65} label="AvenirNextCondensed-Italic" value="AvenirNextCondensed-Italic" />,
    <Picker.Item key={66} label="AvenirNextCondensed-Medium" value="AvenirNextCondensed-Medium" />,
    <Picker.Item key={67} label="AvenirNextCondensed-MediumItalic" value="AvenirNextCondensed-MediumItalic" />,
    <Picker.Item key={68} label="AvenirNextCondensed-Regular" value="AvenirNextCondensed-Regular" />,
    <Picker.Item key={69} label="AvenirNextCondensed-UltraLight" value="AvenirNextCondensed-UltraLight" />,
    <Picker.Item key={70} label="AvenirNextCondensed-UltraLightItalic" value="AvenirNextCondensed-UltraLightItalic" />,
    <Picker.Item key={71} label="Bangla Sangam MN" value="Bangla Sangam MN" />,
    <Picker.Item key={72} label="Baskerville" value="Baskerville" />,
    <Picker.Item key={73} label="Baskerville-Bold" value="Baskerville-Bold" />,
    <Picker.Item key={74} label="Baskerville-BoldItalic" value="Baskerville-BoldItalic" />,
    <Picker.Item key={75} label="Baskerville-Italic" value="Baskerville-Italic" />,
    <Picker.Item key={76} label="Baskerville-SemiBold" value="Baskerville-SemiBold" />,
    <Picker.Item key={77} label="Baskerville-SemiBoldItalic" value="Baskerville-SemiBoldItalic" />,
    <Picker.Item key={78} label="Bodoni 72" value="Bodoni 72" />,
    <Picker.Item key={79} label="Bodoni 72 Oldstyle" value="Bodoni 72 Oldstyle" />,
    <Picker.Item key={80} label="Bodoni 72 Smallcaps" value="Bodoni 72 Smallcaps" />,
    <Picker.Item key={81} label="Bodoni Ornaments" value="Bodoni Ornaments" />,
    <Picker.Item key={82} label="BodoniOrnamentsITCTT" value="BodoniOrnamentsITCTT" />,
    <Picker.Item key={83} label="BodoniSvtyTwoITCTT-Bold" value="BodoniSvtyTwoITCTT-Bold" />,
    <Picker.Item key={84} label="BodoniSvtyTwoITCTT-Book" value="BodoniSvtyTwoITCTT-Book" />,
    <Picker.Item key={85} label="BodoniSvtyTwoITCTT-BookIt" value="BodoniSvtyTwoITCTT-BookIt" />,
    <Picker.Item key={86} label="BodoniSvtyTwoOSITCTT-Bol" value="BodoniSvtyTwoOSITCTT-Bol" />,
    <Picker.Item key={87} label="BodoniSvtyTwoOSITCTT-Boo" value="BodoniSvtyTwoOSITCTT-Boo" />,
    <Picker.Item key={88} label="BodoniSvtyTwoSCITCTT-Boo" value="BodoniSvtyTwoSCITCTT-Boo" />,
    <Picker.Item key={89} label="Bradley Han" value="Bradley Han" />,
    <Picker.Item key={90} label="BradleyHandITCTT-Bol" value="BradleyHandITCTT-Bol" />,
    <Picker.Item key={91} label="Chalkboard S" value="Chalkboard S" />,
    <Picker.Item key={92} label="ChalkboardSE-Bold" value="ChalkboardSE-Bold" />,
    <Picker.Item key={93} label="ChalkboardSE-Light" value="ChalkboardSE-Light" />,
    <Picker.Item key={94} label="ChalkboardSE-Regular" value="ChalkboardSE-Regular" />,
    <Picker.Item key={95} label="Chalkduster" value="Chalkduster" />,
    <Picker.Item key={96} label="Chalkduster" value="Chalkduster" />,
    <Picker.Item key={97} label="Cochin" value="Cochin" />,
    <Picker.Item key={98} label="Cochin-Bold" value="Cochin-Bold" />,
    <Picker.Item key={99} label="Cochin-BoldItalic" value="Cochin-BoldItalic" />,
    <Picker.Item key={100} label="Cochin-Italic" value="Cochin-Italic" />,
    <Picker.Item key={101} label="Copperplate" value="Copperplate" />,
    <Picker.Item key={102} label="Copperplate-Bold" value="Copperplate-Bold" />,
    <Picker.Item key={103} label="Copperplate-Light" value="Copperplate-Light" />,
    <Picker.Item key={104} label="Courier" value="Courier" />,
    <Picker.Item key={105} label="Courier New" value="Courier New" />,
    <Picker.Item key={106} label="Courier-Bold" value="Courier-Bold" />,
    <Picker.Item key={107} label="Courier-BoldOblique" value="Courier-BoldOblique" />,
    <Picker.Item key={108} label="Courier-Oblique" value="Courier-Oblique" />,
    <Picker.Item key={109} label="CourierNewPS-BoldItalicMT" value="CourierNewPS-BoldItalicMT" />,
    <Picker.Item key={110} label="CourierNewPS-BoldMT" value="CourierNewPS-BoldMT" />,
    <Picker.Item key={111} label="CourierNewPS-ItalicMT" value="CourierNewPS-ItalicMT" />,
    <Picker.Item key={112} label="CourierNewPSMT" value="CourierNewPSMT" />,
    <Picker.Item key={113} label="Damascus" value="Damascus" />,
    <Picker.Item key={114} label="DamascusBold" value="DamascusBold" />,
    <Picker.Item key={115} label="DamascusLight" value="DamascusLight" />,
    <Picker.Item key={116} label="DamascusMedium" value="DamascusMedium" />,
    <Picker.Item key={117} label="DamascusSemiBold" value="DamascusSemiBold" />,
    <Picker.Item key={118} label="Devanagari Sangam MN" value="Devanagari Sangam MN" />,
    <Picker.Item key={119} label="DevanagariSangamMN" value="DevanagariSangamMN" />,
    <Picker.Item key={120} label="DevanagariSangamMN-Bold" value="DevanagariSangamMN-Bold" />,
    <Picker.Item key={121} label="Didot" value="Didot" />,
    <Picker.Item key={122} label="Didot-Bold" value="Didot-Bold" />,
    <Picker.Item key={123} label="Didot-Italic" value="Didot-Italic" />,
    <Picker.Item key={124} label="DiwanMishafi" value="DiwanMishafi" />,
    <Picker.Item key={125} label="Euphemia UCAS" value="Euphemia UCAS" />,
    <Picker.Item key={126} label="EuphemiaUCAS-Bold" value="EuphemiaUCAS-Bold" />,
    <Picker.Item key={127} label="EuphemiaUCAS-Italic" value="EuphemiaUCAS-Italic" />,
    <Picker.Item key={128} label="Farah" value="Farah" />,
    <Picker.Item key={129} label="Futura" value="Futura" />,
    <Picker.Item key={130} label="Futura-CondensedExtraBold" value="Futura-CondensedExtraBold" />,
    <Picker.Item key={131} label="Futura-CondensedMedium" value="Futura-CondensedMedium" />,
    <Picker.Item key={132} label="Futura-Medium" value="Futura-Medium" />,
    <Picker.Item key={133} label="Futura-MediumItalic" value="Futura-MediumItalic" />,
    <Picker.Item key={134} label="Geeza Pro" value="Geeza Pro" />,
    <Picker.Item key={135} label="GeezaPro-Bold" value="GeezaPro-Bold" />,
    <Picker.Item key={136} label="Georgia" value="Georgia" />,
    <Picker.Item key={137} label="Georgia-Bold" value="Georgia-Bold" />,
    <Picker.Item key={138} label="Georgia-BoldItalic" value="Georgia-BoldItalic" />,
    <Picker.Item key={139} label="Georgia-Italic" value="Georgia-Italic" />,
    <Picker.Item key={140} label="Gill Sans" value="Gill Sans" />,
    <Picker.Item key={141} label="GillSans-Bold" value="GillSans-Bold" />,
    <Picker.Item key={142} label="GillSans-BoldItalic" value="GillSans-BoldItalic" />,
    <Picker.Item key={143} label="GillSans-Italic" value="GillSans-Italic" />,
    <Picker.Item key={144} label="GillSans-Light" value="GillSans-Light" />,
    <Picker.Item key={145} label="GillSans-LightItalic" value="GillSans-LightItalic" />,
    <Picker.Item key={146} label="GillSans-SemiBold" value="GillSans-SemiBold" />,
    <Picker.Item key={147} label="GillSans-SemiBoldItalic" value="GillSans-SemiBoldItalic" />,
    <Picker.Item key={148} label="GillSans-UltraBold" value="GillSans-UltraBold" />,
    <Picker.Item key={149} label="Gujarati Sangam MN" value="Gujarati Sangam MN" />,
    <Picker.Item key={150} label="GujaratiSangamMN" value="GujaratiSangamMN" />,
    <Picker.Item key={151} label="GujaratiSangamMN-Bold" value="GujaratiSangamMN-Bold" />,
    <Picker.Item key={152} label="Gurmukhi MN" value="Gurmukhi MN" />,
    <Picker.Item key={153} label="GurmukhiMN-Bold" value="GurmukhiMN-Bold" />,
    <Picker.Item key={154} label="Heiti SC" value="Heiti SC" />,
    <Picker.Item key={155} label="Heiti TC" value="Heiti TC" />,
    <Picker.Item key={156} label="Helvetica" value="Helvetica" />,
    <Picker.Item key={157} label="Helvetica Neue" value="Helvetica Neue" />,
    <Picker.Item key={158} label="Helvetica-Bold" value="Helvetica-Bold" />,
    <Picker.Item key={159} label="Helvetica-BoldOblique" value="Helvetica-BoldOblique" />,
    <Picker.Item key={160} label="Helvetica-Light" value="Helvetica-Light" />,
    <Picker.Item key={161} label="Helvetica-LightOblique" value="Helvetica-LightOblique" />,
    <Picker.Item key={162} label="Helvetica-Oblique" value="Helvetica-Oblique" />,
    <Picker.Item key={163} label="HelveticaNeue-Bold" value="HelveticaNeue-Bold" />,
    <Picker.Item key={164} label="HelveticaNeue-BoldItalic" value="HelveticaNeue-BoldItalic" />,
    <Picker.Item key={165} label="HelveticaNeue-CondensedBlack" value="HelveticaNeue-CondensedBlack" />,
    <Picker.Item key={166} label="HelveticaNeue-CondensedBold" value="HelveticaNeue-CondensedBold" />,
    <Picker.Item key={167} label="HelveticaNeue-Italic" value="HelveticaNeue-Italic" />,
    <Picker.Item key={168} label="HelveticaNeue-Light" value="HelveticaNeue-Light" />,
    <Picker.Item key={169} label="HelveticaNeue-LightItalic" value="HelveticaNeue-LightItalic" />,
    <Picker.Item key={170} label="HelveticaNeue-Medium" value="HelveticaNeue-Medium" />,
    <Picker.Item key={171} label="HelveticaNeue-MediumItalic" value="HelveticaNeue-MediumItalic" />,
    <Picker.Item key={172} label="HelveticaNeue-Thin" value="HelveticaNeue-Thin" />,
    <Picker.Item key={173} label="HelveticaNeue-ThinItalic" value="HelveticaNeue-ThinItalic" />,
    <Picker.Item key={174} label="HelveticaNeue-UltraLight" value="HelveticaNeue-UltraLight" />,
    <Picker.Item key={175} label="HelveticaNeue-UltraLightItalic" value="HelveticaNeue-UltraLightItalic" />,
    <Picker.Item key={176} label="Hiragino Mincho ProN" value="Hiragino Mincho ProN" />,
    <Picker.Item key={177} label="Hiragino Sans" value="Hiragino Sans" />,
    <Picker.Item key={178} label="HiraginoSans-W3" value="HiraginoSans-W3" />,
    <Picker.Item key={179} label="HiraginoSans-W6" value="HiraginoSans-W6" />,
    <Picker.Item key={180} label="HiraMinProN-W3" value="HiraMinProN-W3" />,
    <Picker.Item key={181} label="HiraMinProN-W6" value="HiraMinProN-W6" />,
    <Picker.Item key={182} label="Hoefler Text" value="Hoefler Text" />,
    <Picker.Item key={183} label="HoeflerText-Black" value="HoeflerText-Black" />,
    <Picker.Item key={184} label="HoeflerText-BlackItalic" value="HoeflerText-BlackItalic" />,
    <Picker.Item key={185} label="HoeflerText-Italic" value="HoeflerText-Italic" />,
    <Picker.Item key={186} label="HoeflerText-Regular" value="HoeflerText-Regular" />,
    <Picker.Item key={187} label="Iowan Old Style" value="Iowan Old Style" />,
    <Picker.Item key={188} label="IowanOldStyle-Bold" value="IowanOldStyle-Bold" />,
    <Picker.Item key={189} label="IowanOldStyle-BoldItalic" value="IowanOldStyle-BoldItalic" />,
    <Picker.Item key={190} label="IowanOldStyle-Italic" value="IowanOldStyle-Italic" />,
    <Picker.Item key={191} label="IowanOldStyle-Roman" value="IowanOldStyle-Roman" />,
    <Picker.Item key={192} label="Kailasa" value="Kailasa" />,
    <Picker.Item key={193} label="Kailasa-Bold" value="Kailasa-Bold" />,
    <Picker.Item key={194} label="Kannada Sangam MN" value="Kannada Sangam MN" />,
    <Picker.Item key={195} label="KannadaSangamMN" value="KannadaSangamMN" />,
    <Picker.Item key={196} label="KannadaSangamMN-Bold" value="KannadaSangamMN-Bold" />,
    <Picker.Item key={197} label="Khmer Sangam MN" value="Khmer Sangam MN" />,
    <Picker.Item key={198} label="Kohinoor Bangla" value="Kohinoor Bangla" />,
    <Picker.Item key={199} label="Kohinoor Devanagari" value="Kohinoor Devanagari" />,
    <Picker.Item key={200} label="Kohinoor Telugu" value="Kohinoor Telugu" />,
    <Picker.Item key={201} label="KohinoorBangla-Light" value="KohinoorBangla-Light" />,
    <Picker.Item key={202} label="KohinoorBangla-Regular" value="KohinoorBangla-Regular" />,
    <Picker.Item key={203} label="KohinoorBangla-Semibold" value="KohinoorBangla-Semibold" />,
    <Picker.Item key={204} label="KohinoorDevanagari-Light" value="KohinoorDevanagari-Light" />,
    <Picker.Item key={205} label="KohinoorDevanagari-Regular" value="KohinoorDevanagari-Regular" />,
    <Picker.Item key={206} label="KohinoorDevanagari-Semibold" value="KohinoorDevanagari-Semibold" />,
    <Picker.Item key={207} label="KohinoorTelugu-Light" value="KohinoorTelugu-Light" />,
    <Picker.Item key={208} label="KohinoorTelugu-Medium" value="KohinoorTelugu-Medium" />,
    <Picker.Item key={209} label="KohinoorTelugu-Regular" value="KohinoorTelugu-Regular" />,
    <Picker.Item key={210} label="Lao Sangam MN" value="Lao Sangam MN" />,
    <Picker.Item key={211} label="Malayalam Sangam MN" value="Malayalam Sangam MN" />,
    <Picker.Item key={212} label="MalayalamSangamMN" value="MalayalamSangamMN" />,
    <Picker.Item key={213} label="MalayalamSangamMN-Bold" value="MalayalamSangamMN-Bold" />,
    <Picker.Item key={214} label="Marker Felt" value="Marker Felt" />,
    <Picker.Item key={215} label="MarkerFelt-Thin" value="MarkerFelt-Thin" />,
    <Picker.Item key={216} label="MarkerFelt-Wide" value="MarkerFelt-Wide" />,
    <Picker.Item key={217} label="Menlo" value="Menlo" />,
    <Picker.Item key={218} label="Menlo-Bold" value="Menlo-Bold" />,
    <Picker.Item key={219} label="Menlo-BoldItalic" value="Menlo-BoldItalic" />,
    <Picker.Item key={220} label="Menlo-Italic" value="Menlo-Italic" />,
    <Picker.Item key={221} label="Menlo-Regular" value="Menlo-Regular" />,
    <Picker.Item key={222} label="Mishafi" value="Mishafi" />,
    <Picker.Item key={223} label="Noteworthy" value="Noteworthy" />,
    <Picker.Item key={224} label="Noteworthy-Bold" value="Noteworthy-Bold" />,
    <Picker.Item key={225} label="Noteworthy-Light" value="Noteworthy-Light" />,
    <Picker.Item key={226} label="Optima" value="Optima" />,
    <Picker.Item key={227} label="Optima-Bold" value="Optima-Bold" />,
    <Picker.Item key={228} label="Optima-BoldItalic" value="Optima-BoldItalic" />,
    <Picker.Item key={229} label="Optima-ExtraBlack" value="Optima-ExtraBlack" />,
    <Picker.Item key={230} label="Optima-Italic" value="Optima-Italic" />,
    <Picker.Item key={231} label="Optima-Regular" value="Optima-Regular" />,
    <Picker.Item key={232} label="Oriya Sangam MN" value="Oriya Sangam MN" />,
    <Picker.Item key={233} label="OriyaSangamMN" value="OriyaSangamMN" />,
    <Picker.Item key={234} label="OriyaSangamMN-Bold" value="OriyaSangamMN-Bold" />,
    <Picker.Item key={235} label="Palatino" value="Palatino" />,
    <Picker.Item key={236} label="Palatino-Bold" value="Palatino-Bold" />,
    <Picker.Item key={237} label="Palatino-BoldItalic" value="Palatino-BoldItalic" />,
    <Picker.Item key={238} label="Palatino-Italic" value="Palatino-Italic" />,
    <Picker.Item key={239} label="Palatino-Roman" value="Palatino-Roman" />,
    <Picker.Item key={240} label="Papyrus" value="Papyrus" />,
    <Picker.Item key={241} label="Papyrus-Condensed" value="Papyrus-Condensed" />,
    <Picker.Item key={242} label="Party LET" value="Party LET" />,
    <Picker.Item key={243} label="PartyLetPlain" value="PartyLetPlain" />,
    <Picker.Item key={244} label="PingFang HK" value="PingFang HK" />,
    <Picker.Item key={245} label="PingFang SC" value="PingFang SC" />,
    <Picker.Item key={246} label="PingFang TC" value="PingFang TC" />,
    <Picker.Item key={247} label="PingFangHK-Light" value="PingFangHK-Light" />,
    <Picker.Item key={248} label="PingFangHK-Medium" value="PingFangHK-Medium" />,
    <Picker.Item key={249} label="PingFangHK-Regular" value="PingFangHK-Regular" />,
    <Picker.Item key={250} label="PingFangHK-Semibold" value="PingFangHK-Semibold" />,
    <Picker.Item key={251} label="PingFangHK-Thin" value="PingFangHK-Thin" />,
    <Picker.Item key={252} label="PingFangHK-Ultralight" value="PingFangHK-Ultralight" />,
    <Picker.Item key={253} label="PingFangSC-Light" value="PingFangSC-Light" />,
    <Picker.Item key={254} label="PingFangSC-Medium" value="PingFangSC-Medium" />,
    <Picker.Item key={255} label="PingFangSC-Regular" value="PingFangSC-Regular" />,
    <Picker.Item key={256} label="PingFangSC-Semibold" value="PingFangSC-Semibold" />,
    <Picker.Item key={257} label="PingFangSC-Thin" value="PingFangSC-Thin" />,
    <Picker.Item key={258} label="PingFangSC-Ultralight" value="PingFangSC-Ultralight" />,
    <Picker.Item key={259} label="PingFangTC-Light" value="PingFangTC-Light" />,
    <Picker.Item key={260} label="PingFangTC-Medium" value="PingFangTC-Medium" />,
    <Picker.Item key={261} label="PingFangTC-Regular" value="PingFangTC-Regular" />,
    <Picker.Item key={262} label="PingFangTC-Semibold" value="PingFangTC-Semibold" />,
    <Picker.Item key={263} label="PingFangTC-Thin" value="PingFangTC-Thin" />,
    <Picker.Item key={264} label="PingFangTC-Ultralight" value="PingFangTC-Ultralight" />,
    <Picker.Item key={265} label="Savoye LET" value="Savoye LET" />,
    <Picker.Item key={266} label="SavoyeLetPlain" value="SavoyeLetPlain" />,
    <Picker.Item key={267} label="Sinhala Sangam MN" value="Sinhala Sangam MN" />,
    <Picker.Item key={268} label="SinhalaSangamMN" value="SinhalaSangamMN" />,
    <Picker.Item key={269} label="SinhalaSangamMN-Bold" value="SinhalaSangamMN-Bold" />,
    <Picker.Item key={270} label="Snell Roundhand" value="Snell Roundhand" />,
    <Picker.Item key={271} label="SnellRoundhand-Black" value="SnellRoundhand-Black" />,
    <Picker.Item key={272} label="SnellRoundhand-Bold" value="SnellRoundhand-Bold" />,
    <Picker.Item key={273} label="Symbol" value="Symbol" />,
    <Picker.Item key={274} label="Tamil Sangam MN" value="Tamil Sangam MN" />,
    <Picker.Item key={275} label="TamilSangamMN-Bold" value="TamilSangamMN-Bold" />,
    <Picker.Item key={276} label="Telugu Sangam MN" value="Telugu Sangam MN" />,
    <Picker.Item key={277} label="Thonburi" value="Thonburi" />,
    <Picker.Item key={278} label="Thonburi-Bold" value="Thonburi-Bold" />,
    <Picker.Item key={279} label="Thonburi-Light" value="Thonburi-Light" />,
    <Picker.Item key={280} label="Times New Roman" value="Times New Roman" />,
    <Picker.Item key={281} label="TimesNewRomanPS-BoldItalicMT" value="TimesNewRomanPS-BoldItalicMT" />,
    <Picker.Item key={282} label="TimesNewRomanPS-BoldMT" value="TimesNewRomanPS-BoldMT" />,
    <Picker.Item key={283} label="TimesNewRomanPS-ItalicMT" value="TimesNewRomanPS-ItalicMT" />,
    <Picker.Item key={284} label="TimesNewRomanPSMT" value="TimesNewRomanPSMT" />,
    <Picker.Item key={285} label="Trebuchet MS" value="Trebuchet MS" />,
    <Picker.Item key={286} label="Trebuchet-BoldItalic" value="Trebuchet-BoldItalic" />,
    <Picker.Item key={287} label="TrebuchetMS-Bold" value="TrebuchetMS-Bold" />,
    <Picker.Item key={288} label="TrebuchetMS-Italic" value="TrebuchetMS-Italic" />,
    <Picker.Item key={289} label="Verdana" value="Verdana" />,
    <Picker.Item key={290} label="Verdana-Bold" value="Verdana-Bold" />,
    <Picker.Item key={291} label="Verdana-BoldItalic" value="Verdana-BoldItalic" />,
    <Picker.Item key={292} label="Verdana-Italic" value="Verdana-Italic" />,
    <Picker.Item key={293} label="Zapf Dingbats" value="Zapf Dingbats" />,
    <Picker.Item key={294} label="ZapfDingbatsITC" value="ZapfDingbatsITC" />,
    <Picker.Item key={295} label="Zapfino" value="Zapfino" />]
})
class NoteEditor extends React.Component {
    state = { ...this.props.item, colorPicker: "", theme: globe.theme }
    getData = () => {
        let { fontColor, fontFamily, note, backgroundColor, fontSize, title } = this.state;
        return { fontColor, fontFamily, note, backgroundColor, fontSize, title }
    }
    componentDidMount() {
        this.props.getData(this.getData)
    }
    render() {
        let { fontColor, fontSize, fontFamily } = this.state;
        let iconColour = this.state.theme == "light" ? "#000000" : "#ffffff";
        return (
            <View>
                <View style={{ flexDirection: "row", backgroundColor: "#777777" }}>
                    <Picker
                        selectedValue={fontSize}
                        style={{ height: 50, width: 90 }}
                        onValueChange={(fontSize) =>
                            this.setState({ fontSize })
                        }
                        itemStyle={{ maxHeight: 1 }}
                        mode="dropdown"
                    >
                        <Picker.Item label="8" value={8} />
                        <Picker.Item label="9" value={9} />
                        <Picker.Item label="10" value={10} />
                        <Picker.Item label="12" value={12} />
                        <Picker.Item label="14" value={14} />
                        <Picker.Item label="16" value={16} />
                        <Picker.Item label="18" value={18} />
                        <Picker.Item label="20" value={20} />
                        <Picker.Item label="22" value={22} />
                        <Picker.Item label="24" value={24} />
                        <Picker.Item label="26" value={26} />
                        <Picker.Item label="28" value={28} />
                        <Picker.Item label="36" value={36} />
                        <Picker.Item label="48" value={48} />
                        <Picker.Item label="72" value={72} />
                    </Picker>
                    <Picker
                        selectedValue={fontFamily}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(fontFamily) =>
                            this.setState({ fontFamily })
                        }
                        mode="dropdown">
                        {fontList}
                    </Picker>
                    <View style={{ position: "relative", marginTop: 7, flexDirection: "row", right: 10 }}>
                        <Text style={[style.layOut.fontBu, { fontWeight: "bold", backgroundColor: this.state.bold ? "#555555" : "#00000000" }]}
                            onPress={() => this.setState(({ bold }) => ({ bold: !bold }))}>B</Text>
                        <Text style={[style.layOut.fontBu, { fontStyle: "italic", backgroundColor: this.state.italic ? "#555555" : "#00000000" }]}
                            onPress={() => this.setState(({ italic }) => ({ italic: !italic }))}>I</Text>
                        <Text style={[style.layOut.fontBu, { textDecorationLine: "underline", backgroundColor: this.state.underline ? "#555555" : "#00000000" }]}
                            onPress={() => this.setState(({ underline }) => ({ underline: !underline }))}>U</Text>
                    </View>
                    <TouchableHighlight underlayColor="#555555" onPress={() => this.setState({ colorPicker: "backgroundColor" })} style={{ position: "relative", marginLeft: 10, marginTop: 11, height: 25, width: 30, right: 15 }}>
                        <Text>
                            <FontAwesomeIcon icon={faFillDrip} color={this.state.backgroundColor} />
                            ⌄</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#555555" onPress={() => this.setState({ colorPicker: "fontColor" })} style={{ position: "relative", marginTop: 11, height: 25, width: 30, right: 15 }}>
                        <Text>
                            <FontAwesomeIcon icon={faFont} color={fontColor} />
                            ⌄</Text>
                    </TouchableHighlight>
                </View>
                <View style={{ backgroundColor: this.state.backgroundColor, minHeight: "100%" }}>
                    <TextInput returnKeyType="next" placeholder="Your title here" placeholderTextColor={fontColor} value={this.state.title} style={{ fontSize: 40 }} onChangeText={title => this.setState({ title })} onSubmitEditing={() => this.secondTextInput.focus()} />
                    <TextInput
                        ref={(input) => this.secondTextInput = input}
                        placeholder="Add your note here"
                        placeholderTextColor={fontColor}
                        multiline={true}
                        style={{
                            fontSize: parseInt(fontSize),
                            fontFamily, fontWeight: this.state.bold ? "bold" : "normal", fontStyle: this.state.italic ? "italic" : "normal", textDecorationLine: this.state.underline ? "underline" : "none",
                            color: fontColor
                        }}
                        onChangeText={(note) => this.setState({ note })}
                        value={this.state.note} />
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={Boolean(this.state.colorPicker)}
                    onRequestClose={() => this.setState({ colorPicker: "" })}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#00000055" }}>
                        <View style={[style[this.state.theme].ViewStyle, {
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 260,
                            width: "60%",
                            borderWidth: 1,
                            borderColor: '#808080',
                            borderRadius: 7,
                        }]}>
                            <Text style={{ position: "absolute", top: 1, color: iconColour, fontSize: 15, marginTop: 15, fontWeight: "bold", fontFamily: "Roboto" }}>{this.state.colorPicker === "fontColor" ? "Font Colour" : "Background Colour"}</Text>
                            <TouchableHighlight onPress={() => this.setState({ colorPicker: "" })} style={{ alignSelf: "flex-end", margin: 5 }}><FontAwesomeIcon size={30} color={iconColour} icon={faTimesCircle} /></TouchableHighlight>
                            <TriangleColorPicker style={{ height: "80%", width: "90%" }} oldColor={this.state[this.state.colorPicker]} onColorSelected={colour => this.setState(({ colorPicker }) => ({ [colorPicker]: colour, colorPicker: "" }))} />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

NoteEditor.propTypes = {
    getData: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired

}
export default NoteEditor;