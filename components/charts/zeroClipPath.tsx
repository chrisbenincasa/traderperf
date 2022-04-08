import { DataContext } from '@visx/xychart';
import { RectClipPath } from '@visx/clip-path';
import { useContext } from 'react';
import { AxisScale } from '@visx/axis';

type Props = {
  idAbove: string;
  idBelow: string;
};

export default function ZeroClipPath<
  XScale extends AxisScale,
  YScale extends AxisScale
>(props: Props) {
  const { xScale, yScale, margin } = useContext(DataContext);
  const marginTop = margin?.top ?? 0;
  const marginLeft = margin?.left ?? 0;
  const marginRight = margin?.right ?? 0;

  let heightAbove = 0,
    width = 0,
    heightBelow = 0;
  if (yScale && xScale) {
    const x = xScale as XScale,
      y = yScale as YScale;

    const yMin = y.range()[0]?.valueOf() ?? 0;
    const y0 = y(0)?.valueOf() ?? 0;
    const xMax = x.range()[1]?.valueOf() ?? 0;

    heightBelow = yMin - y0;
    heightAbove = y0 - marginTop;
    width = xMax - marginRight;
  }

  return (
    <>
      <RectClipPath
        id={props.idAbove}
        width={width}
        height={heightAbove}
        x={marginLeft}
        y={marginTop}
      />
      <RectClipPath
        id={props.idBelow}
        width={width}
        height={heightBelow}
        x={marginLeft}
        y={heightAbove + marginTop}
      />
    </>
  );
}
