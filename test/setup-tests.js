jest.useFakeTimers()

jest.mock('Easing', () => {
  return {
    _bezier: jest.fn(),
    _easing: jest.fn(),
    inOut: jest.fn(),
    out: jest.fn(),
    poly: jest.fn(),
    linear: jest.fn(),
    in: jest.fn(),
  }
})

jest.mock('Animated', () => {
  return {
    View: props => (props.children ? props.children : null),
    Value: jest.fn(() => {
      return {
        interpolate: jest.fn(),
      }
    }),
    spring: jest.fn(() => {
      return {
        start: jest.fn(callback => {
          callback()
        }),
      }
    }),
    timing: jest.fn(() => {
      return {
        start: jest.fn(callback => {
          callback()
        }),
      }
    }),
  }
})

jest.mock('NativeAnimatedHelper')
