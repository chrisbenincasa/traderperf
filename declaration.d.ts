// declaration.d.ts
declare module '*.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: any;
  export default styles;
}

declare module '@mui/material/styles' {}
