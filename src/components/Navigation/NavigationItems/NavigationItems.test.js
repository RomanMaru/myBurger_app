import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import NavigationItems from './NavigationItems.js'
import NavigationItem from './NavigationItem'

configure({ adapter: new Adapter() })

describe('<NavigationIItems />', () => {
    it('should render two <NavigationItem /> elements if not aithenticated', () => {
        const wrapper = shallow(<NavigationItems />)
        expect(wrapper.find(NavigationItem)).toHaveLength(2)
    })
})