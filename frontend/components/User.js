// import { Query } from "@apollo/client/react/components";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import PropTypes from "prop-types";

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      surname
      # permissions
      # subjects
      # courseVisits {
      #   id
      #   reminders
      # }
      # teacherFeedback {
      #   id
      #   text
      #   lesson {
      #     id
      #     name
      #   }
      # }
      # level {
      #   id
      #   level
      # }
      # studentFeedback {
      #   id
      #   text
      #   lesson {
      #     id
      #     name
      #   }
      # }
      # new_subjects {
      #   id
      # }
      # company {
      #   id
      #   name
      # }
      status
      # lessonResults {
      #   id
      # }
      uni {
        id
        title
        teachers {
          id
        }
        capacity
        paidMonths
        # uniCoursePages {
        #   id
        # }
      }
      # examAnswers {
      #   id
      #   examQuestion {
      #     id
      #     question
      #     coursePage {
      #       title
      #       id
      #     }
      #   }
      #   answer
      # }
      # isFamiliar
      # favourites
      # coverLetter
      # resume
      # visitedLessons
      # coursePages {
      #   id
      # }
      # lessons {
      #   id
      # }
      # careerTrack {
      #   id
      # }
      # careerTrackID
    }
  }
`;

// const User = (props) => {
//   const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
//   return (data) => <div>{props.children(data.user)</div>;
// };

// User.propTypes = {
//   children: PropTypes.func.isRequired,
// };

// export default User;
// export { CURRENT_USER_QUERY };

function useUser() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  console.log(data);
  if (data) {
    return data.me;
  }
}

export { CURRENT_USER_QUERY, useUser };
