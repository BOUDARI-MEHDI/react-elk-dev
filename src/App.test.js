import React from "react";

import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

import { ErrorBoundary, Facet, SearchProvider, SearchBox, Results, PagingInfo, ResultsPerPage, Paging, Sorting, WithSearch } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new ElasticsearchAPIConnector({
  host: "https://search-elastic.es.eu-west-3.aws.elastic-cloud.com",
  apiKey: "RmlIR2o0RUJHN0w0VGdveWxkZFQ6UER5eW9RUUNTMS1jbHNnYS1ibnZKUQ==",
  index: "previewtestcurlonly"
});

const config = {
  searchQuery: {
    // section search field for searchbar
    search_fields: {
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
      url: {
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
          weight: 10
        }
      },
      result_fields: {
        title: {
          snippet: {
            size: 1000,
            fallback: true
          }
        },
        url: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        results: { fields: ["GC_completion"] }
      },
      size: 10
    }
  },
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
};

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
          autocompleteMinimumCharacters={3}
          autocompleteResults={{
            linkTarget: "_blank",
            sectionTitle: "Results",
            titleField: "title",
            urlField: "url",
            shouldTrackClickThrough: true
          }}
          autocompleteSuggestions={true}
          debounceLength={0}
        />
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
      bodyContent={<Results shouldTrackClickThrough={true} />}
      bodyHeader={
        <React.Fragment>
          {wasSearched && <PagingInfo />}
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
