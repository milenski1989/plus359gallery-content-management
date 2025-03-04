import * as React from 'react';
import {Tabs, Tab, Box} from '@mui/material';
export default function TabsWrapper({labels, components }) {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value}>
          {labels.map((label, index) => (
            <Tab key={label} label={label} onClick={() => setValue(index)} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {components.map((Component, index) => (
          <React.Fragment key={index}>
            {value === index && <Component />}
          </React.Fragment>
        ))}
      </Box>
    </>
  );
}