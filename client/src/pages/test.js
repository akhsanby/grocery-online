export default function Test() {
  return (
    <div>
      <h1>token</h1>
    </div>
  );
}

export function getServerSideProps(ctx) {
  console.log(ctx.req.headers.cookie);

  return { props: {} };
}
