import React from 'react'
import { Animated } from 'react-native'
import { render } from 'react-native-testing-library'
import Transition from '../transition'

describe('<Transition />', () => {
  test('empty render', () => {
    expect(() => render(<Transition />)).not.toThrow()
  })

  test('animation transform as prop', () => {
    const animation = jest.fn()
    render(<Transition animation={animation} />)
    expect(animation).toHaveBeenCalledTimes(1)
  })

  test('animates when `in` prop changes', () => {
    const { update } = render(<Transition />)
    expect(Animated.spring).toHaveBeenCalledTimes(0)

    update(<Transition in />)
    expect(Animated.spring).toHaveBeenCalledTimes(1)

    update(<Transition in={false} />)
    expect(Animated.spring).toHaveBeenCalledTimes(2)
  })

  test('onTransitionEnd called after transition', () => {
    const onTransitionEnd = jest.fn()
    render(<Transition onTransitionEnd={onTransitionEnd} in />)
    // expect(Animated.spring).toHaveBeenCalledTimes(0)
    expect(onTransitionEnd).toHaveBeenCalledTimes(1)
  })

  test('animation config as a prop', () => {
    const fakeAnimationConfig = {
      test: 'me',
      toValue: 1,
    }

    render(<Transition configIn={fakeAnimationConfig} in />)
    expect(Animated.spring).toHaveBeenCalledWith(expect.any(Object), {
      ...fakeAnimationConfig,
      useNativeDriver: true,
    })
  })
})
