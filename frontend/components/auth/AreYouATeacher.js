import { Query } from "@apollo/client/react/components";
import { CURRENT_USER_QUERY } from "../User";
import Link from "next/link";
import { NavButton } from "../styles/Button";

const AreYouATeacher = (props) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data }, loading) => {
      if (loading) return <p>Loading...</p>;
      if (data.me) {
        if (
          data.me.coursePages.filter((obj) => obj.id == props.subject).length ==
            0 &&
          !data.me.permissions.includes("ADMIN")
        ) {
          return (
            <div>
              <h1>
                Вы не имеете прав на просмотр содержимого данной страницы.
              </h1>
              <Link
                href={{
                  pathname: "/courses",
                }}
              >
                <a>
                  <NavButton>Главная страница</NavButton>
                </a>
              </Link>
            </div>
          );
        }
      }
      return props.children;
    }}
  </Query>
);

export default AreYouATeacher;
