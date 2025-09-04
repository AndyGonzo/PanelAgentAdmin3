// @ts-nocheck
import React from "react";
import TextField from "@mui/material/TextField";


const TextareaWidget = (props: any) => {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    label,
    onChange,
    options = {},
    autofocus,
    placeholder,
    rawErrors,
  } = props;
  
  console.log('TextareaWidget props:', props);
  
  return (
    <TextField
      id={id}
      label={label}
      value={value || ""}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      placeholder={placeholder || options.placeholder || "Enter detailed instructions..."}
      error={!!rawErrors && rawErrors.length > 0}
      helperText={rawErrors && rawErrors.length > 0 ? rawErrors.join(". ") : ""}
      multiline
      minRows={options.rows || 8}
      maxRows={options.maxRows || 20}
      fullWidth
      variant="outlined"
      onChange={e => onChange(e.target.value)}
      sx={{
        '& .MuiInputBase-root': {
          minHeight: '120px',
        },
      }}
    />
  );
};

export default TextareaWidget;
