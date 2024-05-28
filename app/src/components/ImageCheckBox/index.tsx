import {useUncontrolled} from "@mantine/hooks";
import {Checkbox, Image, Text, UnstyledButton} from "@mantine/core";
import classes from "./index.module.css";

interface ImageCheckboxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?(checked: boolean): void;
    title: string;
    description: string;
    image: string;
}

export function ImageCheckbox({
                                  checked,
                                  defaultChecked,
                                  onChange,
                                  title,
                                  description,
                                  image,
                                  ...others
                              }: ImageCheckboxProps & Omit<React.ComponentPropsWithoutRef<'button'>, keyof ImageCheckboxProps>) {
    const [value, handleChange] = useUncontrolled({
        value: checked,
        defaultValue: defaultChecked,
        finalValue: false,
        onChange,
    });


    return (
        <UnstyledButton
            {...others}
            onClick={() => handleChange(!value)}
            data-checked={value || undefined}
            className={classes.button}
        >
            <Image src={image} alt={title} width={40} height={40} />

            <div className={classes.body}>
                <Text c="dimmed" size="xs" lh={1} mb={5}>
                    {description}
                </Text>
                <Text fw={500} size="sm" lh={1}>
                    {title}
                </Text>
            </div>

            <Checkbox
                checked={value}
                onChange={() => {}}
                tabIndex={-1}
                styles={{ input: { cursor: 'pointer' } }}
            />
        </UnstyledButton>
    );
}
