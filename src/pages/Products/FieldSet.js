const fieldset = {
    padding: '.35em .625em .75em',
    border: '1px solid silver',
    width: '100%',
}

const legend = {
    border: 0,
    margin: 0,
    padding: '0 .5em',
    width: 'auto',
    color: '#108ee9',
}
class Fieldset extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {}
    render() {
        let wrapper = {...fieldset, ...this.props.style || {}}
        return <fieldset style={wrapper}>
            <legend style={legend}>{this.props.title}</legend>
            {this.props.children}
        </fieldset>
    }
}
export default Fieldset