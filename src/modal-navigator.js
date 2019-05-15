import React from 'react'
import PropTypes from 'prop-types'
import { Dimensions, ViewPropTypes, Platform } from 'react-native'
import { withModalNavigation } from './navigator'
import Screen from './screen'
import { fadeInOut } from './animations'
import { mapScreenProps } from './lib'

const { height: screenHeight } = Dimensions.get('window')

class Modal extends React.Component {
  static propTypes = {
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
    navigation: PropTypes.shape({
      modal: PropTypes.shape({
        active: PropTypes.bool,
      }),
    }),
  }

  state = {
    active: false,
    transitioning: false,
    modalIndex: null,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      if (this.props.activeIndex !== -1) {
        this.setState({
          active: true,
          modalIndex: this.props.activeIndex,
          transitioning: this.props.animated,
        })
      } else {
        this.setState({
          active: false,
          transitioning: this.props.animated,
        })
      }
    }
  }

  handleTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

  animation = anim => {
    return {
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [screenHeight, 0],
          }),
        },
      ],
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    const focused = this.state.active || this.state.transitioning

    const child = focused
      ? children[this.state.modalIndex]
      : children[this.props.activeIndex]

    if (!child) {
      return null
    }

    if (!this.state.transitioning && !this.state.active) {
      return null
    }

    const animation = Platform.select({
      ios: this.animation,
      android: fadeInOut,
    })

    const { screen, transition } = mapScreenProps(
      this.props.activeIndex,
      this.props,
      this.state,
      child
    )

    return (
      <Screen
        index={this.props.activeIndex}
        screen={screen}
        transition={{
          in: this.state.active,
          onTransitionEnd: this.handleTransitionEnd,
          animation: animation,
          ...transition,
        }}
      >
        {React.cloneElement(child, {
          navigation: this.props.navigation,
          focused: this.state.active,
        })}
      </Screen>
    )
  }
}

export { Modal }
export default withModalNavigation(Modal)
