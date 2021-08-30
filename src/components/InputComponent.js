import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@material-ui/core/";

import DateFnsUtils from "@date-io/date-fns";

import { DatePicker, LocalizationProvider } from "@material-ui/lab";

export const InputComponent = (props) => {
  switch (props.fieldData.type) {
    case Boolean:
      return (
        <FormControl fullWidth={true}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.notificationDetails[props.fieldData.name]}
                onChange={(obj) =>
                  props.onChangeHandler(obj, props.fieldData.type)
                }
                id={props.fieldData.name}
              />
            }
            label={props.fieldData.name}
          />
        </FormControl>
      );

    case Date:
      return (
        <LocalizationProvider dateAdapter={DateFnsUtils}>
          <DatePicker
            label={props.fieldData.name}
            value={props.notificationDetails[props.fieldData.name]}
            onChange={(date) =>
              props.onChangeHandler(
                props.fieldData.name,
                props.fieldData.type,
                date
              )
            }
            autoFocus={props.fieldData.autoFocus}
            renderInput={(params) => <TextField {...params} autoFocus={props.fieldData.autoFocus}/>}
          />
        </LocalizationProvider>
      );

    default:
      return (
        <FormControl fullWidth={true} required={props.fieldData.required}>
          <InputLabel htmlFor={props.fieldData.name}>
            {props.fieldData.name}
          </InputLabel>
          <Input
            id={props.fieldData.name}
            aria-describedby="my-helper-text"
            error={props.fieldData.error}
            value={props.notificationDetails[props.fieldData.name]}
            onChange={(obj) => props.onChangeHandler(obj, props.fieldData.type)}
            autoFocus={props.fieldData.autoFocus}
          />
          {props.fieldData.formHelperText !== "" && (
            <FormHelperText id="my-helper-text">
              {props.fieldData.formHelperText}
            </FormHelperText>
          )}
        </FormControl>
      );
  }
};
