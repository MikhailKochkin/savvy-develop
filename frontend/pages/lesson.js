import SingleLesson from "../components/lesson/SingleLesson";
import NewSingleLesson from "../components/lesson/NewSingleLesson";
import Challenge from "../components/lesson/challenge/Challenge";

const LessonPage = (props) => (
  <div>
    {props.query.type === "regular" && (
      <SingleLesson id={props.query.id} type={props.query.type} />
    )}
    {props.query.type === "story" && (
      <NewSingleLesson id={props.query.id} type={props.query.type} />
    )}
    {props.query.type === "challenge" && (
      <Challenge id={props.query.id} type={props.query.type} />
    )}
  </div>
);

export default LessonPage;
