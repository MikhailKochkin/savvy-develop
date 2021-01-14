import React, { useState } from "react";
import styled from "styled-components";

const Styles = styled.div`
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 2% 0;
  font-weight: bold;
  margin-bottom: 2%;
  .text {
    flex-basis: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
  .img {
    flex-basis: 50%;
  }
`;

const Text = styled.div`
  width: 100%;
  text-align: left;
  padding: 2% 0;
  /* color: #696969; */
  div {
    margin-bottom: 2%;
    padding-top: 0;
  }
  .bold {
    font-size: 1.6rem;
    margin-bottom: 2%;
    font-weight: bold;
  }
  .link {
    color: #00008b;
    cursor: pointer;
  }
`;

const Img = styled.img`
  width: 200px;
`;

const ListItem = styled.div`
  .arrow {
    cursor: pointer;
  }
`;

const HowTo = (props) => {
  const [revealed, setRevealed] = useState("standard");
  return (
    <Styles>
      <Container>
        <Header>
          <div className="text">Модель создания онлайн урока</div>
          <div className="text">
            <Img src="../../static/teach.svg" />
          </div>
        </Header>
        <ListItem>
          1️. Стандартная модель урока
          <span
            className="arrow"
            onClick={(e) =>
              revealed === "standard"
                ? setRevealed(null)
                : setRevealed("standard")
            }
          >
            {revealed === "standard" ? ` 🔼` : ` 🔽`}
          </span>
        </ListItem>
        <>
          {revealed === "standard" && (
            <>
              <Text>
                <div className="bold">
                  1.1 Презентация материала в формате лонгрида и алогритма
                </div>
                <div>
                  <div>
                    В лонгриде можно дать необходимую информацию в видео и
                    текстовом форматах. Также можно добавить таблицы, схемы,
                    любые внешние ресурсы, например, гугл слайды. Обязательно
                    укажите вв самом начале лонгрида, какие занания и навыки
                    получит ученик от прохождения урока.
                  </div>{" "}
                  <div>
                    Для создания лонгрида перейдите в раздел{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createNote")}
                    >
                      "Новый лонгрид"
                    </span>
                    .
                  </div>{" "}
                  <div>
                    Через алгоритм удобно показывать последовательность
                    действий. Например, шаги по составлению документа или подаче
                    документ в гос орган.
                  </div>{" "}
                  <div>
                    Для создания алгоритма перейдите в раздел{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createShot")}
                    >
                      "Новый алгоритм"
                    </span>
                    .
                  </div>{" "}
                </div>
              </Text>
              <Text>
                <div className="bold">1.2 Проверка новых знаний</div>
                <div>
                  <div>
                    Знания можно проверить с помощью тестов и открытых вопросов.
                  </div>{" "}
                  <div>
                    Для их создания лонгрида перейдите в разделы{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createTest")}
                    >
                      "Новый тест"
                    </span>{" "}
                    и{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createQuiz")}
                    >
                      "Новый вопрос"
                    </span>
                    .
                  </div>
                </div>
              </Text>
              <Text>
                <div className="bold">1.3 Применение новых знаний: задачи </div>
                <div>
                  <div>
                    Составьте задачи, чтобы научить своих учеников решать
                    сложные проблемы в несколько этапов. Задача состоит из
                    текста задачи, подсказок, ответа и поэтапного решения.
                    Каждый этап представлен в виде теста, открытого вопроса или
                    пояснения.
                  </div>{" "}
                  <div>
                    Для создания задачи перейдите в раздел{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createProblem")}
                    >
                      "Новая задача"
                    </span>{" "}
                  </div>
                </div>
              </Text>
              <Text>
                <div className="bold">
                  1.4 Применение новых знаний: конструкторы и редакторов
                  документов
                </div>
                <div>
                  <div>
                    Многие задачи в праве упираются в создание документов. Чтобы
                    выработать такой навык у учеников используйте
                    специализированные задания: конструктор документов и
                    редактор документов. Первое учит структурировать документ и
                    определять, что в него надо, а что не надо добавлять. Второе
                    учит вычитывать документы, искать в нем недостатки и
                    исправлять их.
                  </div>{" "}
                  <div>
                    Для создания контруктора документов перейдите в раздел{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createConstructor")}
                    >
                      "Новый конструктор"
                    </span>{" "}
                    , а для создания редактора документов – в раздел{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createTextEditor")}
                    >
                      "Новый редактор"
                    </span>{" "}
                    .
                  </div>
                </div>
              </Text>
              <Text>
                <div className="bold">
                  1.5 Практическое задание с обратной связью
                </div>
                <div>
                  <div>
                    Некоторые задания в интерактивной форме представить нельзя.
                    По ним нужно давать обратную связь. Для этого вы можете
                    создать задания в формате документа. Документ – это
                    письменное задание, которое разделено на составные части с
                    пояснениями. Впоследствии по каждой составной части можно
                    дать обратную связь.
                  </div>{" "}
                  <div>
                    Для создания документа перейдите в раздел{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createDocument")}
                    >
                      "Новый документ"
                    </span>{" "}
                  </div>
                </div>
              </Text>
              <Text>
                <div className="bold">
                  1.6 Подведение итогов в формате лонгрида
                </div>
                <div>
                  <div>
                    В лонгриде нужно подвести итоги урока: дать основные выводы,
                    указать, что еще можно почитать и посмотреть, указать, что
                    следует изучить дальше.
                  </div>{" "}
                  <div>
                    Для подведения итогов перейдите в раздел{" "}
                    <span
                      className="link"
                      onClick={(e) => props.getLink("createNote")}
                    >
                      "Новый лонгрид"
                    </span>
                    .
                  </div>{" "}
                </div>
              </Text>
            </>
          )}
        </>
      </Container>
    </Styles>
  );
};

export default HowTo;
