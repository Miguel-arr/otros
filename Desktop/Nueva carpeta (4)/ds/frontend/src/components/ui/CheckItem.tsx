/**
 * Checkbox con label — encapsula el patrón check-label.
 */
interface CheckItemProps {
    readonly name: string;
    readonly label: string;
    readonly checked: boolean;
    readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckItem({ name, label, checked, onChange }: CheckItemProps) {
    return (
        <label className="check-label" htmlFor={name}>
            <input
                id={name}
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="check-label__input"
            />
            <span className="check-label__text">{label}</span>
        </label>
    );
}
