import PleaseSignIn from "../components/auth/PleaseSignIn";
import dynamic from "next/dynamic";

const DynamicLoadedEditor = dynamic(
  import("../components/create/CreateProblem"),
  {
    loading: () => <p>Загрузка...</p>,
    ssr: false,
  }
);

const CreateProblemPage = ({ ...props }) => (
  <PleaseSignIn>
    {console.log(props.query.id)}
    <DynamicLoadedEditor id={props.query.id} />
  </PleaseSignIn>
);

export default CreateProblemPage;
