import styles from './index.less'

function DetailTile(props){
    const {title,style={}}=props
    return (<div className={styles.detailtile} style={{...style}}>
        {title}
        {props.children}
    </div>)
}
export default DetailTile