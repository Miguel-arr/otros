interface RadioGroupProps {
    readonly label: string;
    readonly name: string;
    readonly value: string;
    readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly options?: readonly string[];
    readonly compact?: boolean; // 👈 NUEVO (modo tabla)
}

/** Toggle-button style radio group — mejor UX para mobile + soporte tabla */
export default function RadioGroup({
    label,
    name,
    value,
    onChange,
    options = ['SI', 'NO', 'N/A'],
    compact = false
}: RadioGroupProps) {

    // 🔹 Base botones (ligeramente ajustado para tabla también)
    const baseClass = [
        'px-2 py-1 text-xs font-semibold cursor-pointer',
        'border transition-all font-[inherit]',
        'flex-1 text-center select-none'
    ].join(' ');

    return (
        <div
            className={
                compact
                    ? 'w-full flex' // 👉 modo tabla (sin espacios raros)
                    : 'flex justify-between items-center py-2.5 border-b border-gray-100 gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:py-2'
            }
        >
            {/* 🔹 Label SOLO en modo normal */}
            {!compact && (
                <span className="flex-1 font-medium text-[0.8125rem] text-gray-700 min-w-0">
                    {label}
                </span>
            )}

            {/* 🔹 Opciones */}
            <div className={compact ? 'flex w-full' : 'flex shrink-0 max-sm:w-full'}>
                {options.map((opt, i) => {
                    const isActive = value === opt;

                    const roundClass =
                        i === 0 ? 'rounded-l-md' :
                        i === options.length - 1 ? 'rounded-r-md' : '';

                    const overlapClass = i > 0 ? '-ml-[1px]' : '';

                    const stateClass = isActive
                        ? 'bg-navy-800 border-navy-800 text-white z-10'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-navy-800 hover:text-navy-800';

                    return (
                        <label
                            key={opt}
                            className={`${baseClass} ${roundClass} ${overlapClass} ${stateClass}`}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={opt}
                                checked={isActive}
                                onChange={onChange}
                                className="hidden"
                            />
                            {opt}
                        </label>
                    );
                })}
            </div>
        </div>
    );
}