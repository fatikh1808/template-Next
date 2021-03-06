import styles from "./test.module.scss";

export default function testTypography({ children }) {
    return (
        <div className={styles.test}>
            {children}
            <p className={"testStyle"}>Hello bitches 3</p>
        </div>
    );
}
