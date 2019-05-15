import React from 'react'
import { View, Text, Button } from 'react-native'
import { render, fireEvent } from 'react-native-testing-library'
import {
  Navigator,
  Stack,
  Switch,
  Header,
  Tabs,
  TabBar,
  Tab,
} from '../../react-native-navigation-components'

test('stack navigation', () => {
  function StackApp() {
    return (
      <Navigator name="stack" initialState={{ hello: '123' }}>
        {({ navigation, activeIndex }) => {
          return (
            <View style={{ flex: 1 }}>
              <Header>
                <Button title="Header 1" onPress={() => navigation.reset()} />
                <Button title="Header 2" onPress={() => navigation.pop()} />
                <Button title="Header 3" onPress={() => navigation.pop()} />
              </Header>

              <Stack>
                <View name="screen-1">
                  <Button
                    title="Screen 1"
                    onPress={() => navigation.push({ hello: 'joe' })}
                  />
                  {activeIndex === 0 && (
                    <Text>{`hello ${navigation.state.hello}`}</Text>
                  )}
                </View>

                <View name="screen-2">
                  <Button
                    title="Screen 2"
                    onPress={() => navigation.push({ hello: 'hi' })}
                  />
                  {activeIndex === 1 && (
                    <Text>{`hello ${navigation.state.hello}`}</Text>
                  )}
                </View>

                <View name="screen-3">
                  <Button
                    title="Screen 3"
                    onPress={() => navigation.pop({ hello: 'hey' })}
                  />

                  {activeIndex === 2 && (
                    <Text>{`hello ${navigation.state.hello}`}</Text>
                  )}
                </View>
              </Stack>
            </View>
          )
        }}
      </Navigator>
    )
  }

  const { getByText } = render(<StackApp />)
  getByText('hello 123')
  fireEvent.press(getByText('Screen 1'))
  getByText('hello joe')
  fireEvent.press(getByText('Screen 2'))
  getByText('hello hi')
  fireEvent.press(getByText('Screen 3'))
  getByText('hello hey')
  fireEvent.press(getByText('Header 2'))
  getByText('hello hey')
  fireEvent.press(getByText('Header 1'))
  getByText('hello 123')
})

test('tabs navigation', () => {
  function TabsApp() {
    return (
      <Navigator name="tabs">
        {({ navigation }) => {
          return (
            <View style={{ flex: 1 }}>
              <Tabs>
                <View name="screen-1">
                  <Button title="Screen 1" onPress={() => navigation.push()} />
                </View>
                <View name="screen-2">
                  <Button title="Screen 2" onPress={() => navigation.push()} />
                </View>
                <View name="screen-3">
                  <Button title="Screen 3" onPress={() => navigation.pop()} />
                </View>
              </Tabs>

              <TabBar>
                <Tab>
                  <Text>Tab 1</Text>
                </Tab>
                <Tab>
                  <Text>Tab 2</Text>
                </Tab>
                <Tab>
                  <Text>Tab 3</Text>
                </Tab>
              </TabBar>
            </View>
          )
        }}
      </Navigator>
    )
  }

  const { getByText } = render(<TabsApp />)

  fireEvent.press(getByText('Tab 1'))

  fireEvent.press(getByText('Tab 2'))

  fireEvent.press(getByText('Tab 3'))

  fireEvent.press(getByText('Tab 1'))

  fireEvent.press(getByText('Tab 2'))
  fireEvent.press(getByText('Screen 2'))

  fireEvent.press(getByText('Tab 1'))
  fireEvent.press(getByText('Screen 1'))

  fireEvent.press(getByText('Tab 3'))
  fireEvent.press(getByText('Screen 3'))
})

test('switch navigator', async () => {
  function SwitchApp() {
    return (
      <Navigator name="switch">
        {({ navigation }) => {
          return (
            <View style={{ flex: 1 }}>
              <Header>
                <View hidden />
                <Button title="Header 2" onPress={() => navigation.pop()} />
              </Header>
              <Switch>
                <View name="screen-1">
                  <Button title="Screen 1" onPress={() => navigation.push()} />
                </View>
                <View name="screen-2">
                  <Button title="Screen 2" onPress={() => navigation.push()} />
                </View>
                <View name="screen-3">
                  <Button title="Screen 3" onPress={() => navigation.pop()} />
                </View>
              </Switch>
            </View>
          )
        }}
      </Navigator>
    )
  }

  const { getByText } = render(<SwitchApp />)

  expect(() => getByText('Screen 2')).toThrow()

  fireEvent.press(getByText('Screen 1'))
  expect(() => getByText('Screen 1')).toThrow()

  fireEvent.press(getByText('Screen 2'))
  expect(() => getByText('Screen 2')).toThrow()

  fireEvent.press(getByText('Screen 3'))
  expect(() => getByText('Screen 3')).toThrow()

  fireEvent.press(getByText('Header 2'))
  expect(() => getByText('Screen 2')).toThrow()
})
