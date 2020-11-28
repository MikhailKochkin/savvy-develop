// import { useUser } from "../components/User";
import Courses from "../components/course/Courses";
import { i18n, withTranslation } from "../i18n";

const Index = ({ t }) => {
  return (
    <>
      {/* <button
        onClick={() =>
          i18n.changeLanguage(i18n.language === "en" ? "ru" : "en")
        }
      >
        {t("change-locale")}
      </button> */}
      {/* <User>{({ data: { me } }) => <Courses />}</User> */}
      <Courses />
      {/* <div>Привет!</div> */}
    </>
  );
};

Index.getInitialProps = async () => ({
  namespacesRequired: ["common", "footer"],
});

export default withTranslation("common")(Index);
