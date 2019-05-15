import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { Stack } from '../stack-navigator'

describe('<Stack />', () => {
  test('empty render', () => {
    expect(() => render(<Stack name="stack" activeIndex={0} />)).not.toThrow()
  })

  test('renders all children up to activeIndex', () => {
    const { getByText } = render(<Navigation activeIndex={1} />)

    getByText('1')
    getByText('2')
    expect(() => getByText('3')).toThrow()
  })

  test('unmounts children that are not active', () => {
    const { getByText, update } = render(<Navigation activeIndex={1} />)

    update(<Navigation activeIndex={0} />)

    expect(() => getByText('2')).toThrow()
  })

  test('can render a single child', () => {
    expect(() =>
      render(
        <Stack name="stack" activeIndex={0}>
          <Text>1</Text>
        </Stack>
      )
    ).not.toThrow()
  })
})

function Navigation(props) {
  return (
    <Stack name="stack" {...props} animated={false}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
    </Stack>
  )
}
