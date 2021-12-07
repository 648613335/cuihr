export default function (props) {
    return (
        <div>
            {typeof props.render == 'function' ? props.render(props) : props.value}
        </div>
    );
}
