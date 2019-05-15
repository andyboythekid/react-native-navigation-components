import { Platform, Animated, Easing, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

const config = Platform.select({
  ios: {
    configIn: {
      timing: Animated.spring,
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    configOut: {
      timing: Animated.spring,
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  },
  android: {
    configIn: {
      duration: 350,
      easing: Easing.out(Easing.poly(5)),
      timing: Animated.timing,
    },
    configOut: {
      duration: 150,
      easing: Easing.in(Easing.linear),
      timing: Animated.timing,
    },
  },
})

function slideInOut(indices) {
  const [index, previous, active] = indices
  return function(anim) {
    return {
      transform: [
        {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: calculateTranslateX(index, previous, active),
            extrapolate: 'clamp',
          }),
        },
      ],
    }
  }
}

function fadeInOut(anim) {
  return {
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 0.9, 1],
      outputRange: [0, 0.25, 0.7, 1],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [height * 0.08, 0],
        }),
      },
    ],
  }
}

function calculateTranslateX(index, previous, active) {
  let outputRange = []

  if (index === active) {
    if (previous > index) {
      outputRange = [-width, 0]
    } else {
      outputRange = [width, 0]
    }
  } else {
    if (index < active) {
      outputRange = [-width, 0]
    } else {
      outputRange = [width, 0]
    }
  }

  return outputRange
}

export { config, slideInOut, fadeInOut }
