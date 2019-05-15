import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, ViewPropTypes } from 'react-native'
import Transition from './transition'

// type Props = {
//   activeIndex: number,
//   previousIndex: number,
//   index: number,
//   children: any,

//   transition: {
//     in: boolean,
//     config?: any,
//     configIn?: any,
//     configOut?: any,
//     onTransitionEnd?: () => void,
//     animation?: (animatedValue: any) => any,
//   },

//   screen: {
//     style: any,
//     testID: string,
//     optimized: boolean,
//     animated: boolean,
//   },
// }

class Screen extends React.Component {
  static propTypes = {
    activeIndex: PropTypes.number,
    previousIndex: PropTypes.number,
    index: PropTypes.number.isRequired,
    transition: PropTypes.shape({
      in: PropTypes.bool.isRequired,
      config: PropTypes.object,
      configIn: PropTypes.object,
      configOut: PropTypes.object,
      onTransitionEnd: PropTypes.func,
      animation: PropTypes.func,
    }),
    screen: PropTypes.shape({
      style: ViewPropTypes.style,
      testID: PropTypes.string,
      optimized: PropTypes.bool,
      animated: PropTypes.bool,
    }),
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.screen.optimized) {
      if (nextProps.activeIndex === this.props.index) {
        return true
      }

      if (nextProps.previousIndex === this.props.index) {
        if (nextProps.screen.transitioning) {
          return true
        }
      }

      return false
    }

    return true
  }

  render() {
    if (this.props.screen.animated) {
      return (
        <Transition {...this.props.transition}>
          <View
            testID={this.props.screen.testID}
            style={{ flex: 1, ...this.props.screen.style }}
          >
            {this.props.children}
          </View>
        </Transition>
      )
    }

    return (
      <View
        style={{
          flex: 1,
          ...StyleSheet.absoluteFillObject,
          ...this.props.screen.style,
        }}
      >
        {this.props.children}
      </View>
    )
  }
}

export default Screen
