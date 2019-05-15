import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { Switch } from '../switch-navigator'

describe('<Switch />', () => {
  test('empty render', () => {
    expect(() => render(<Switch name="switch" activeIndex={0} />)).not.toThrow()
  })

  test('renders only one child at a time', () => {
    const { getByText, update } = render(<Navigation activeIndex={1} />)
    getByText('2')
    expect(() => getByText('1')).toThrow()

    update(<Navigation activeIndex={0} />)
    getByText('1')
    expect(() => getByText('2')).toThrow()
  })

  test('transitions from one screen to another', () => {
    const { getByText, update } = render(<Navigation activeIndex={0} />)

    getByText('1')
    expect(() => getByText('2')).toThrow()

    update(<Navigation activeIndex={1} />)
    getByText('2')
    expect(() => getByText('1')).toThrow()
  })

  test('can render a single child', () => {
    expect(() =>
      render(
        <Switch name="switch" activeIndex={0}>
          <Text>1</Text>
        </Switch>
      )
    ).not.toThrow()
  })
})

function Navigation(props) {
  return (
    <Switch activeIndex={0} {...props} name="switch" animated={false}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
    </Switch>
  )
}
