import React from 'react'
import PropTypes from 'prop-types'
import { View, ViewPropTypes, Platform, Animated } from 'react-native'
import { withScreenNavigation } from './navigator'
import Screen from './screen'
import { slideInOut, fadeInOut } from './animations'
import { mapScreenProps } from './lib'

// type Props = {
//   activeIndex: number,
//   children: any,
//   style: any,
//   screenStyle: any,
//   animated: boolean,
//   transition: {
//     config: any,
//     configIn: any,
//     configOut: any,
//     animation: animatedValue => any,
//     onTransitionEnd: () => void,
//   },
//   navigation: Navigation,
// }

// type State = {
//   activeIndex: number,
//   previousIndex?: number,
//   transitioning: boolean,
// }

class Switch extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    activeIndex: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
    screenStyle: ViewPropTypes.style,
    animated: PropTypes.bool,
    transition: PropTypes.shape({
      config: PropTypes.object,
      configIn: PropTypes.object,
      configOut: PropTypes.object,
      animation: PropTypes.func,
      onTransitionEnd: PropTypes.func,
    }),
    navigation: PropTypes.object,
  }

  state = {
    activeIndex: this.props.activeIndex,
    previousIndex: null,
    transitioning: false,
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        previousIndex: prevState.activeIndex,
        activeIndex: nextProps.activeIndex,
        transitioning: nextProps.animated,
      }
    }

    return null
  }

  handleTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

  render() {
    const arr = React.Children.toArray(this.props.children)

    const children = []

    if (this.state.transitioning) {
      children.push(this.state.previousIndex)
    }

    children.push(this.props.activeIndex)

    return (
      <View style={[{ flex: 1, overflow: 'hidden' }, this.props.style]}>
        {children.map(childIndex => {
          const child = arr[childIndex]

          if (!child) {
            return null
          }

          const focused = childIndex === this.props.activeIndex

          const indices = [
            childIndex,
            this.state.previousIndex,
            this.props.activeIndex,
          ]

          const animation = Platform.select({
            ios: slideInOut(indices),
            android: fadeInOut,
          })

          const { screen, transition } = mapScreenProps(
            childIndex,
            this.props,
            this.state,
            child
          )

          return (
            <Screen
              key={childIndex}
              activeIndex={this.props.activeIndex}
              previousIndex={this.state.previousIndex}
              index={childIndex}
              screen={{
                ...screen,
                optimized: true,
              }}
              transition={{
                in: childIndex === this.props.activeIndex,
                onTransitionEnd: this.handleTransitionEnd,
                method:
                  Platform.OS === 'android' ? Animated.timing : Animated.spring,
                animation: animation,
                ...transition,
              }}
            >
              {React.cloneElement(child, {
                navigation: this.props.navigation,
                focused: focused,
              })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export { Switch }
export default withScreenNavigation(Switch)
