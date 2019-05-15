import React from 'react'
import { View, Platform, StyleSheet } from 'react-native'
import { withNavigation } from './navigator'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0

class Header extends React.Component {
  render() {
    if (this.props.hidden) {
      return null
    }

    const children = React.Children.toArray(this.props.children)
    const child = children[this.props.activeIndex]

    if (!child || child.props.hidden) {
      return null
    }

    return (
      <View style={[styles.header, this.props.style]}>
        {React.cloneElement(child, {
          activeIndex: this.props.activeIndex,
          navigation: this.props.navigation,
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: STATUSBAR_HEIGHT,
    height: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#A7A7AA',
      },
      android: {
        elevation: 4,
      },
    }),
  },
})

export { Header }
export default withNavigation(Header)
