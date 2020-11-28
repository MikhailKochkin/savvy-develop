import UpdateExamQuestion from "../components/course/UpdateExamQuestion";

const UpdateExam = ({ query }) => (
  <div>
    <UpdateExamQuestion id={query.id} />
  </div>
);

export default UpdateExam;
