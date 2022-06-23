import React from "react";
// script ELK APP Search
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { ErrorBoundary, Facet, SearchProvider, SearchBox, Results, PagingInfo, ResultsPerPage, Paging, WithSearch, Sorting } from "@elastic/react-search-ui";
import { Layout,  } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
// Css Custom for ELK App Search
import "../src/search.css";
import searchUi from '../src/assets/searchUi.svg';
import { setSearchTerm } from "@elastic/search-ui/lib/esm/actions";

// connector ELK Search
const connector = new ElasticsearchAPIConnector({
  host: "https://search-elastic.es.eu-west-3.aws.elastic-cloud.com",
  apiKey: "anRha2tJRUJjY0VUX3ItOE93ZjU6TmtpMzN6WEpTaXFZa3BCZ1F2NDQwdw==",
  index: "mehdi_test"
});

// Configuration App Search
const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    search_fields: {
      // section search field for searchbar
      title: {
        weight: 10
      },
      content: {
        weight: 7
      }
    },
    result_fields: {
      // section result field
      title: {
        snippet: {
          fallback: true
        }
      },
      nps_link: {
        raw: {}
      },
      content: {
        snippet: {
          size: 1000, 
          fallback: true
        }
      },
      page: {
       raw: {}
      },
      paragraph: {
       raw: {}
      }
    },
    disjunctiveFacets: [""],
    facets: {
      // section facet parameter

      facet: { type: "value" },
      author: { type: "value" },
      extension: { type: "value"},
      page: { type: "value"},
      creation_date: {
        type: "range",
        ranges: [
          {
            from: '2020-01-01T01:01:33.420Z',
            name: "Les anciens documents"
          },
          {
            from: '2021-01-01T01:01:33.420Z',
            to: '2021-12-31T23:59:33.420Z',
            name: "Les documents en 2021"
          },
          {
            to: '2022-01-01T01:01:33.420Z',
            name: "Les documents de 2022"
          }
        ]
      },
      modification_date: {
        type: "range",
        ranges: [

          {
            from: '2021-01-01T01:01:33.420Z',
            to: '2021-12-31T23:59:33.420Z',
            name: "Document modifié en 2021"
          },
          {
            to: '2022-01-01T01:01:33.420Z',
            name: "Document modifié cette année"
          }
        ]
      },
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        "title.suggest": {
          weight: 3
        }
      },
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        url: {
          raw: {}
        }
      }
    },
    content: {
      types: {
        results: { fields: ["movie_completion"] }
      },
      size: 4
    }
  },
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
}; 





// customizing Search-result HTML
const CustomResultView = (
  { result, onClickLink }: {
  result: SearchResult;
  onClickLink: () => void;
}) => (
<li className="sui-result">
  <div className="sui-result__header">
    <h3>
        {/* Maintain onClickLink to correct track click throughs for analytics*/}
        <a onClick={onClickLink} href={result.nps_link.raw} target="blank">
        {result.title.snippet} 
        </a>
      </h3>
  </div>
    <div className="sui-result__body">
      {/* Use the 'snippet' property of fields with dangerouslySetInnerHtml to render snippets */}
      <div className="sui-result__details" dangerouslySetInnerHTML={{ __html: result.content.snippet }}>
        
      </div>
    </div>
    <div className="sui-result__button" >
      <button className="sui-result__button-page" type="button" alt="tag page bouton non cliquable" disabled>Page : {result.page.raw} </button>
      <button className="sui-result__button-paragraph" type="button" alt="tag paragraphe bouton non cliquable" disabled>Paragraphe : {result.paragraph.raw} </button>
    </div>
</li>
); 


export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
  <ErrorBoundary>
    <Layout
      header={
        <SearchBox
                    inputView={({ getAutocomplete, getInputProps, getButtonProps }) => (
                    <>
                    <div className="sui-search-box__wrapper-iconSearch">
      <img src={searchUi} alt="icone recherche"></img>

</div>
                    <div className="sui-search-box__wrapper">
                    
                      <input 
                        {...getInputProps ({ placeholder: "Je saisie ma recherche ici !"  }) }
                      />
                        {getAutocomplete({
                        "sectionTitle": "Suggested Results",
                        "titleField": "title",
                        "urlField": "nps_link", 
                        })
                      }
                    </div>
                    <input
                      {...getButtonProps({
                        
                        "data-custom-attr": "some value",
                        "value": "rechercher"
                        })
                        
                      }
                    />
                    
                    </>
                    )}
          autocompleteSuggestions={
            {
              title: {
              sectionTitle: "Suggested Queries",
              },
              popular_queries: {
                sectionTitle: "Popular Queries"
              }
            }} /*debounceLength={0}*/ />
      }
      sideContent={
        <div>
          {wasSearched && <Sorting label={"Sort by"} sortOptions={[]} />}
          <Facet key={"1"} field={"facet"} label={"Grand-compte"} filterType="any" isFilterable={true} />
          <Facet key={"2"} field={"author"} label={"Auteur"} filterType="any" isFilterable={true} />
          <Facet key={"3"} field={"extension"} label={"Extension"} filterType="any" isFilterable={true} />
          <Facet key={"4"} field={"page"} label={"pages"}  filterType="any" isFilterable={false}/>
          <Facet key={"5"} field={"creation_date"} label={"date de création"} filterType="any" />
          <Facet key={"6"} field={"modification_date"} label={"date de modification"} filterType="any" />
        </div>
      }
      bodyContent={
        <Results 
          /*resultView={CustomResultView}*/
          shouldTrackClickThrough={true}

          /*
          resultView={({ result, onClickLink }) => {
            return (
              <div onClick={onClickLink}>
                <h4>{result.title.snippet}</h4>
                  <a href={result.nps_link.raw}>Link</a>
              </div>
              );
            }}
          */
        />
      }
      bodyHeader={
        <React.Fragment>
          {wasSearched && <PagingInfo 
           view={({ start, end }: { start: number, end: number }) => (
            <div className="paging-info">
              <strong>
                Debut : page n°{start} - fin : page n°{end}
              </strong>
            </div>
          )}
          />}
          {wasSearched && <ResultsPerPage />}
        </React.Fragment>
      }
      bodyFooter={<Paging />}
    />
  </ErrorBoundary>
</div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
