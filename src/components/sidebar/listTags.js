/* eslint-disable react-hooks/exhaustive-deps */
import "./listTags.css";
import { useState, useContext, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { DataContext } from "../../context/context";

export default function ListTags(props) {
  console.log("cc", props);
  const { setTagMain, mainTags } = useContext(DataContext);
  const [tagObject, setTagObject] = useState({});
  const [viewWidth, setViewWidth] = useState();

  useEffect(() => {
    if (!viewWidth) {
      setViewWidth(window.innerWidth);
    }

    window.addEventListener("resize", () => {
      setViewWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setViewWidth(window.innerWidth);
      });
    };
  }, [viewWidth]);

  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState("");
  let tags = { ...mainTags };
  console.log(mainTags, tags);

  useEffect(() => {
    setTagObject({ ...props.tags });
  }, []);

  const sendTagValue = (value) => {
    if (tags.hasOwnProperty(props.tagName)) {
      if (tags[props.tagName].includes(value)) {
        const index = tags[props.tagName].indexOf(value);
        tags[props.tagName].splice(index, 1);
      } else {
        tags[props.tagName].push(value);
      }
    } else {
      tags[props.tagName] = [];
      tags[props.tagName].push(value);
    }
    for (let key in tags) {
      if (tags[key].length === 0) {
        delete tags[key];
      }
    }
    setTagMain(tags);
  };

  const TagItem = (props) => {
    const [hover, setHover] = useState(false);
    const [click, setClick] = useState(false);

    const handleHover = (value) => {
      setHover(value);
    };
    const handleClick = () => {
      click ? setClick(false) : setClick(true);
      sendTagValue(props.tagValue);
    };

    return (
      <>
        {props.tagNumber > 0 && (
          <div
            className={`tagItem ${hover || click ? "tagItemHover" : ""}`}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            onClick={handleClick}
          >
            {props.tagValue}
            <div className="tagItemNumber">{props.tagNumber}</div>
          </div>
        )}
      </>
    );
  };

  const handleSearch = ({ target: { value } }) => {
    setSearch(value);

    const regex = new RegExp(value, "gi");
    if (value.length > 0) {
      let sample = { ...tagObject };
      for (let key in tagObject) {
        if (!regex.test(key)) delete sample[key];
      }
      setTagObject({ ...sample });
    } else setTagObject({ ...props.tags });
  };

  return (
    <>
      {viewWidth > "600" && (
        <div className="listTagContainer">
          <div className="tagsTop"> </div>
          <div className="tagSearch">
            <form className="inline">
              <label htmlFor="name">
                <AiOutlineSearch />
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Search"
                onChange={handleSearch}
              />
            </form>
          </div>
          <div className="tagBox">
            {Object.keys(tagObject).map((a) => {
              return (
                <TagItem
                  tagValue={a}
                  tagNumber={props.tags[a]}
                  callBackList={sendTagValue}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
