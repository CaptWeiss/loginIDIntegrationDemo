interface ILogProp {
  value: any;
  replacer?: (string | number)[] | null;
  space?: string | number;
}
const LogJson = ({ value, replacer, space }: ILogProp) => (
  <div className="json-logger">
    <pre>
      <code>
        {JSON.stringify(value, replacer, space)}
      </code>
    </pre>
  </div>
);

LogJson.defaultProps = {
  replacer: null,
  space: 2
};

export default LogJson;
