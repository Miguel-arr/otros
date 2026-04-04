/**
 * Input de formulario con label integrado.
 * Equivale al patrón: div.field > label.field__label > input.field__input
 */
interface FieldInputProps {
    readonly label: string;
    readonly name: string;
    readonly value: string | number;
    readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly type?: React.HTMLInputTypeAttribute;
    readonly step?: string;
    readonly placeholder?: string;
    readonly required?: boolean;
    /** Clases extras para el wrapper div.field */
    readonly className?: string;
}

export default function FieldInput({
    label,
    name,
    value,
    onChange,
    type = 'text',
    step,
    placeholder,
    required,
    className = '',
}: FieldInputProps) {
    return (
        <div className={`field ${className}`.trim()}>
            <label className="field__label" htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                step={step}
                placeholder={placeholder}
                required={required}
                className="field__input"
            />
        </div>
    );
}
