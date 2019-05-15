import React from 'react'
import PropTypes from 'prop-types'
import { View, ViewPropTypes } from 'react-native'
import Screen from './screen'
import { withScreenNavigation } from './navigator'
import { slideInOut } from './animations'
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
// }

class Tabs extends React.Component {
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
    rendered: [this.props.activeIndex],
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

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.setState(state => {
        const previous = state.rendered.filter(
          i => i !== this.props.activeIndex
        )
        return {
          rendered: [...previous, this.props.activeIndex],
        }
      })
    }
  }

  handleTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    return (
      <View style={[{ flex: 1, overflow: 'hidden' }, this.props.style]}>
        {this.state.rendered.map(childIndex => {
          const child = children[childIndex]

          if (!child) {
            return null
          }

          const indices = [
            childIndex,
            this.state.previousIndex,
            this.props.activeIndex,
          ]

          const animation = slideInOut(indices)

          const { screen, transition } = mapScreenProps(
            childIndex,
            this.props,
            this.state,
            child
          )

          return (
            <Screen
              key={childIndex}
              index={childIndex}
              previousIndex={this.state.previousIndex}
              activeIndex={this.props.activeIndex}
              screen={{
                optimized: true,
                ...screen,
              }}
              transition={{
                in: childIndex === this.props.activeIndex,
                animation: animation,
                onTransitionEnd: this.handleTransitionEnd,
                ...transition,
              }}
            >
              {React.cloneElement(child, {
                navigation: this.props.navigation,
                focused: childIndex === this.props.activeIndex,
              })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export { Tabs }
export default withScreenNavigation(Tabs)
