import { CanvasRenderer } from 'components/CanvasRenderer'

export default {
  title: 'VTT/CanvasRenderer',
  component: CanvasRenderer,
  argTypes: {},
}

const Template = args => <CanvasRenderer {...args} />

export const Default = Template.bind({})
Default.args = {}
