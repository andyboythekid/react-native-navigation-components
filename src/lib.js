function mapScreenProps(index, props, state, child) {
  const focused = index === props.activeIndex

  const testIDPrefix = props.name ? props.name + '-' : ''

  const screen = {
    testID: focused
      ? `${testIDPrefix}active-screen`
      : `${testIDPrefix}inactive-screen-${index}`,
    animated: props.animated || child.props.animated,
    style: { ...props.screenStyle, ...child.props.style },
    transitioning: state.transitioning,
  }

  const transition = {
    ...props.transition,
    ...child.props.transition,
  }

  return {
    screen,
    transition,
  }
}

export { mapScreenProps }
