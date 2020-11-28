import PaidApplications from "../components/PaidApplications";
import React from "react";
import { Query, Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import dynamic from "next/dynamic";

const CP_QUERY = gql`
  query CP_QUERY {
    coursePages {
      id
      title
      user {
        id
        name
        surname
      }
    }
  }
`;

const UL_MUTATION = gql`
  mutation UL_MUTATION($id: ID!, $authors: [ID]) {
    fixAuthors(id: $id, authors: $authors) {
      id
    }
  }
`;

const paidApplications = () => {
  return (
    <div style={{ margin: "3%" }}>
      <Query
        query={CP_QUERY}
        // variables={{
        //   id: "ck0uxxet8mf7g0b17chxomwow",
        // }}
      >
        {({ data, loading, fetchMore }) => {
          if (loading) return "...";
          console.log(data.coursePages);
          return data.coursePages.map((c, i) => (
            <>
              <div>
                {i + 1}){c.title}
              </div>
              <div>
                {c.user.name} {c.user.surname}
              </div>
              <Mutation
                mutation={UL_MUTATION}
                variables={{
                  id: c.id,
                  authors: [c.user.id],
                }}
              >
                {(fixAuthors, { loading, error }) => (
                  <>
                    <button
                      onClick={async (e) => {
                        // Stop the form from submitting
                        e.preventDefault();
                        // call the mutation
                        const res = await fixAuthors();
                        console.log(1);
                      }}
                    >
                      {loading ? "Сохраняем..." : "Сохранить"}
                    </button>
                  </>
                )}
              </Mutation>
              <hr />
            </>
          ));
        }}
      </Query>
    </div>
  );
};

export default paidApplications;

// const FOR_MONEY_COURSE_PAGES_QUERY = gql`
//   query FOR_MONEY_COURSE_PAGES_QUERY(
//     $type: CourseType!
//     $boolean: Boolean = true
//   ) {
//     coursePages(where: { courseType: $type, published: $boolean }) {
//       id
//       title
//     }
//   }
// `;

// const PaidApplicationsPage = () => (
//   <Query
//     query={FOR_MONEY_COURSE_PAGES_QUERY}
//     returnPartialData={true}
//     fetchPolicy="cache-first"
//     variables={{
//       type: "FORMONEY",
//     }}
//   >
//     {({ data, loading, error }) => {
//       if (loading) return <p>Загрузка...</p>;
//       if (error) return <p>Error: {error.message}</p>;
//       console.log(data.coursePages);
//       return data.coursePages.map((coursePage) => (
//         <PaidApplications id={coursePage.id} title={coursePage.title} />
//       ));
//     }}
//   </Query>
// );

// export default PaidApplicationsPage;
