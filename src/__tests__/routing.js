import React from 'react'
import { Button, Text, View } from 'react-native'

import {
  Navigator,
  Switch,
  Tabs,
  AppNavigation,
  Link,
} from '../../react-native-navigation-components'

import { render, fireEvent } from 'react-native-testing-library'

function App() {
  return (
    <AppNavigation location="/test">
      <Navigator
        name="test"
        screens={['test-1', 'test-2', 'test-3', 'inner-navigator']}
      >
        <Switch>
          <MyButton
            name="test-1"
            onPress={navigation => navigation.push({ test: 'value' })}
          />
          <MyButton
            name="test-2"
            onPress={navigation =>
              navigation.navigate('test-3', { test2: 'value-2' })
            }
          >
            <Link to="/test/inner-navigator/inner-3">
              <Text>go to inner</Text>
            </Link>
          </MyButton>
          <MyButton name="test-3" onPress={navigation => navigation.reset()} />

          <Navigator
            name="inner-navigator"
            screens={['inner-1', 'inner-2', 'inner-3']}
          >
            <Tabs>
              <MyButton
                name="inner-1"
                onPress={navigation => navigation.push()}
              />
              <MyButton
                name="inner-2"
                onPress={navigation => navigation.push()}
              />
              <MyButton
                name="inner-3"
                onPress={navigation => navigation.pop()}
              />
            </Tabs>
          </Navigator>
        </Switch>
      </Navigator>
    </AppNavigation>
  )
}

test('render', () => {
  const { getByText } = render(<App />)

  fireEvent.press(getByText('test-1'))
  fireEvent.press(getByText('go to inner'))

  getByText('inner-3')
})

function MyButton(props) {
  return (
    <View>
      <Button
        title={props.name}
        onPress={() => props.onPress(props.navigation)}
      />
      {props.children}
    </View>
  )
}
