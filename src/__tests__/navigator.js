import React from 'react'
import { Button, View, BackHandler } from 'react-native'
import { render, fireEvent } from 'react-native-testing-library'
import Navigator from '../navigator'
import Stack from '../stack-navigator'

jest.mock('BackHandler', () => {
  let listeners = []
  return {
    fire: () => {
      for (let listener of listeners) {
        if (listener() === true) {
          break
        }
      }
    },
    addEventListener: (name, listener) => {
      listeners = [listener, ...listeners]
    },
    removeEventListener: () => {
      listeners.shift()
    },
  }
})

describe('<Navigator />', () => {
  test('empty render', () => {
    expect(() => render(<Navigator name="123" />)).not.toThrow()
  })

  test('passes navigation in render prop', () => {
    const spy = jest.fn(() => null)

    render(<Navigator name="123" children={spy} screens={['test']} />)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({
      activeIndex: 0,
      activeScreen: 'test',
      navigation: expect.any(Object),
    })

    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "activeIndex": 0,
  "activeScreen": "test",
  "navigation": Object {
    "back": [Function],
    "modal": Object {
      "active": false,
      "activeIndex": -1,
      "dismiss": [Function],
      "show": [Function],
    },
    "navigate": [Function],
    "parent": undefined,
    "pop": [Function],
    "push": [Function],
    "reset": [Function],
    "select": [Function],
    "state": Object {},
  },
}
`)
  })

  test('onNavigationChange fires when navigation is updated', () => {
    const spy = jest.fn()
    render(
      <Navigator name="123" onNavigationChange={spy} screens={['test2']} />
    )

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      activeIndex: 0,
      activeScreen: 'test2',
      navigation: expect.any(Object),
    })

    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "activeIndex": 0,
  "activeScreen": "test2",
  "navigation": Object {
    "back": [Function],
    "modal": Object {
      "active": false,
      "activeIndex": -1,
      "dismiss": [Function],
      "show": [Function],
    },
    "navigate": [Function],
    "parent": undefined,
    "pop": [Function],
    "push": [Function],
    "reset": [Function],
    "select": [Function],
    "state": Object {},
  },
}
`)
  })

  test('navigation functions', () => {
    function NavigationFunctions(props) {
      return (
        <Navigator {...props} screens={['push', 'select', 'navigate', 'pop']}>
          {({ navigation }) => {
            return (
              <View>
                <Button title="push" onPress={() => navigation.push()} />
                <Button title="select" onPress={() => navigation.select(2)} />
                <Button
                  title="navigate"
                  onPress={() => navigation.navigate('pop')}
                />
                <Button title="pop" onPress={() => navigation.pop()} />
              </View>
            )
          }}
        </Navigator>
      )
    }

    const onUpdate = jest.fn()

    const { getByText } = render(
      <NavigationFunctions name="123" onNavigationChange={onUpdate} />
    )

    fireEvent.press(getByText('push'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 1,
      activeScreen: 'select',
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('select'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 2,
      activeScreen: 'navigate',
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('navigate'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 3,
      activeScreen: 'pop',
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('pop'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 2,
      activeScreen: 'navigate',
      navigation: expect.any(Object),
    })
  })

  test('android back button behaviour', () => {
    const onNavigationChange = jest.fn()

    const { getByText } = render(
      <Navigator
        name="android-test"
        screens={['one', 'two']}
        onNavigationChange={onNavigationChange}
      >
        {({ navigation }) => {
          return (
            <Stack>
              <Button title="1" onPress={() => navigation.push()} />
              <Button title="2" onPress={() => navigation.push()} />
            </Stack>
          )
        }}
      </Navigator>
    )

    fireEvent.press(getByText('1'))
    getByText('2')

    BackHandler.fire()

    expect(onNavigationChange).toHaveBeenCalledWith({
      activeIndex: 0,
      activeScreen: 'one',
      navigation: expect.any(Object),
    })
  })

  test('handle back bubbles up to parent', () => {
    const { getByText } = render(
      <Navigator name="android-test" screens={['one', 'two']}>
        {({ navigation }) => {
          return (
            <Stack>
              <Button title="1" onPress={() => navigation.push()} />
              <Navigator name="inner-1">
                {({ navigation: innerNav }) => {
                  return (
                    <Stack>
                      <Button
                        name="second-screen"
                        title="2"
                        onPress={() => innerNav.push()}
                      />
                      <Navigator name="inner-2">
                        <Stack>
                          <Button title="3" onPress={() => navigation.push()} />
                        </Stack>
                      </Navigator>
                    </Stack>
                  )
                }}
              </Navigator>
            </Stack>
          )
        }}
      </Navigator>
    )

    fireEvent.press(getByText('1'))
    fireEvent.press(getByText('2'))
    getByText('3')

    BackHandler.fire()
    getByText('2')

    BackHandler.fire()
    getByText('1')
  })
})
