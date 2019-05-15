import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { TabBar } from '../tab-bar'

describe('<TabBar />', () => {
  test('empty render', () => {
    expect(() => render(<TabBar />)).not.toThrow()
  })

  test('passes active prop and onSelect() to active child', () => {
    const { getByText, update } = render(<MyTabbar activeIndex={2} />)
    expect(getByText('2').props.active).toBe(true)
    expect(getByText('0').props.active).toBe(false)

    update(<MyTabbar activeIndex={0} />)
    expect(getByText('0').props.active).toBe(true)

    expect(getByText('1').props.onSelect).toBeDefined()
  })

  test('can be styled', () => {
    const { toJSON } = render(<TabBar style={{ backgroundColor: 'blue' }} />)
    expect(toJSON()).toMatchInlineSnapshot(`
<View
  style={
    Array [
      Object {
        "backgroundColor": "#fff",
        "borderTopColor": "rgba(0, 0, 0, .3)",
        "borderTopWidth": 0.5,
        "flexDirection": "row",
        "height": 49,
      },
      Object {
        "backgroundColor": "blue",
      },
    ]
  }
/>
`)
  })
})

function MyTabbar(props) {
  return (
    <TabBar {...props}>
      <Text>0</Text>
      <Text>1</Text>
      <Text>2</Text>
    </TabBar>
  )
}
