export const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };

type Props<Data> = {
  data: Data[];
};

export default function BaseAreaChart<Data>(props: Props<Data>) {
  return <div></div>;
}
