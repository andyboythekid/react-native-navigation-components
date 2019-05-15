import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { Header } from '../header'

describe('<Header />', () => {
  test('empty render', () => {
    expect(() => render(<Header />)).not.toThrow()
  })

  test('only renders the active child', () => {
    const { getByText, update } = render(<MyHeader activeIndex={2} />)
    expect(() => getByText('1')).toThrow()
    getByText('3')

    update(<MyHeader activeIndex={0} />)
    expect(() => getByText('3')).toThrow()
    getByText('1')

    update(<MyHeader activeIndex={1} />)
    expect(() => getByText('1')).toThrow()
    getByText('2')
  })

  test('visible and hidden states', () => {
    const { toJSON, update } = render(<MyHeader hidden activeIndex={2} />)
    expect(toJSON()).toBe(null)

    update(<MyHeader hidden={false} activeIndex={2} />)
    expect(toJSON()).not.toBe(null)
  })

  test('passes activeIndex to children', () => {
    const { getByText } = render(<MyHeader activeIndex={1} />)
    expect(getByText('2').props.activeIndex).toEqual(1)
  })

  test('children can hide the header', () => {
    const { toJSON } = render(
      <Header activeIndex={0}>
        <Text hidden />
      </Header>,
    )

    expect(toJSON()).toBe(null)
  })

  test('header can be styled', () => {
    const { toJSON } = render(
      <MyHeader activeIndex={1} style={{ backgroundColor: 'purple' }} />,
    )
    expect(toJSON()).toMatchInlineSnapshot(`
<View
  style={
    Array [
      Object {
        "borderBottomColor": "#A7A7AA",
        "borderBottomWidth": 0.5,
        "height": 64,
        "paddingTop": 20,
      },
      Object {
        "backgroundColor": "purple",
      },
    ]
  }
>
  <Text
    activeIndex={1}
  >
    2
  </Text>
</View>
`)
  })
})

function MyHeader(props) {
  return (
    <Header {...props}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
    </Header>
  )
}
