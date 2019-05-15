import React from 'react'
import PropTypes from 'prop-types'
import { View, ViewPropTypes, Platform, Animated } from 'react-native'
import { withScreenNavigation } from './navigator'
import Screen from './screen'
import { fadeInOut, slideInOut } from './animations'
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

class Stack extends React.Component {
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
    const children = React.Children.toArray(this.props.children).slice(
      0,
      this.state.transitioning
        ? Math.max(this.state.previousIndex + 1, this.props.activeIndex + 1)
        : this.props.activeIndex + 1
    )

    return (
      <View style={[{ flex: 1, overflow: 'hidden' }, this.props.style]}>
        {React.Children.map(children, (child, index) => {
          const indices = [
            index,
            this.state.previousIndex,
            this.props.activeIndex,
          ]

          const animation = Platform.select({
            ios: slideInOut(indices),
            android: fadeInOut,
          })

          const { screen, transition } = mapScreenProps(
            index,
            this.props,
            this.state,
            child
          )

          return (
            <Screen
              index={index}
              activeIndex={this.props.activeIndex}
              previousIndex={this.state.previousIndex}
              screen={{
                optimized: false,
                ...screen,
              }}
              transition={{
                in: index <= this.props.activeIndex,
                onTransitionEnd: this.handleTransitionEnd,
                animation: animation,
                method:
                  Platform.OS === 'android' ? Animated.timing : Animated.spring,
                ...transition,
              }}
            >
              {React.cloneElement(child, {
                navigation: this.props.navigation,
                focused: index === this.props.activeIndex,
              })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export { Stack }
export default withScreenNavigation(Stack)
