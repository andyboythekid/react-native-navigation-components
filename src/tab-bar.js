import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { withNavigation } from './navigator'

const DEFAULT_HEIGHT = 49

class TabBar extends React.Component {
  render() {
    if (this.props.hidden) {
      return null
    }

    return (
      <View style={[styles.tabbar, this.props.style]}>
        {React.Children.map(this.props.children, (child, index) => {
          return React.cloneElement(child, {
            active: index === this.props.activeIndex,
            onSelect: () => this.props.navigation.select(index),
          })
        })}
      </View>
    )
  }
}

class Tab extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[{ flex: 1 }, this.props.style]}
        onPress={this.props.onSelect}
      >
        {React.cloneElement(this.props.children, {
          active: this.props.active,
        })}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  tabbar: {
    height: DEFAULT_HEIGHT,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
  },
})

export { Tab, TabBar }
export default withNavigation(TabBar)
