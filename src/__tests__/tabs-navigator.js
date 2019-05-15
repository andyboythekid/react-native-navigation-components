import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { Tabs } from '../tabs-navigator'

describe('<Tabs />', () => {
  test('empty render', () => {
    expect(() => render(<Tabs name="tabs" activeIndex={0} />)).not.toThrow()
  })

  test('renders the activeIndex', () => {
    const { getByText, update } = render(<Navigation activeIndex={1} />)

    expect(getByText('2'))
    expect(() => getByText('1')).toThrow()

    update(<Navigation activeIndex={0} />)

    expect(getByText('1'))
  })

  test('does not render a child that is not there', () => {
    expect(() => render(<Navigation activeIndex={1000} />)).not.toThrow()
  })

  test('children render in order of activeIndex and remain mounted', () => {
    const { getByText, update } = render(<Navigation activeIndex={1} />)

    expect(() => getByText('1')).toThrow()

    update(<Navigation activeIndex={0} />)

    getByText('2')
    getByText('1')
    expect(() => getByText('3')).toThrow()
  })

  test('can render a single child', () => {
    expect(() =>
      render(
        <Tabs name="tabs" activeIndex={0}>
          <Text>1</Text>
        </Tabs>
      )
    ).not.toThrow()
  })
})

function Navigation(props) {
  return (
    <Tabs name="tabs" activeIndex={props.activeIndex}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
    </Tabs>
  )
}
