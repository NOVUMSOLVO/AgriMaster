import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { testSuite, TestResult } from '../utils/testSuite';

const TestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setShowResults(false);
    
    // Simulate test execution delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testResults = testSuite.runAllTests();
    setResults(testResults);
    setIsRunning(false);
    setShowResults(true);
  };

  const downloadReport = () => {
    const report = testSuite.generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agrimaster-test-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const summary = results.length > 0 ? testSuite.getTestSummary() : null;

  return (
    <div className="glass-card rounded-2xl p-6 m-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">App Test Suite</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="glass-button px-4 py-2 rounded-xl hover-lift disabled:opacity-50 text-white"
        >
          {isRunning ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Running Tests...
            </div>
          ) : (
            <div className="flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Run All Tests
            </div>
          )}
        </button>
      </div>

      {summary && (
        <div className="glass-button rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{summary.passed}</div>
              <div className="text-sm text-gray-300">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{summary.failed}</div>
              <div className="text-sm text-gray-300">Failed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-center text-white font-medium">
              Pass Rate: {summary.passRate.toFixed(1)}%
            </div>
            <div className="w-full glass rounded-full h-3 mt-2">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                style={{ width: `${summary.passRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Test Results</h3>
            <button
              onClick={downloadReport}
              className="glass-button px-3 py-1 rounded-lg text-sm hover-lift text-white"
            >
              <Download className="h-4 w-4 inline mr-1" />
              Download Report
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {results.map((result, index) => (
              <div key={index} className="glass-button rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                    )}
                    <span className="font-medium text-white">{result.testName}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.passed ? 'status-online' : 'status-offline'
                  }`}>
                    {result.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                {result.details && (
                  <div className="text-sm text-gray-300 mt-1 ml-7">
                    {result.details}
                  </div>
                )}
                {result.error && (
                  <div className="text-sm text-red-400 mt-1 ml-7">
                    Error: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!showResults && !isRunning && (
        <div className="text-center text-gray-300 py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Click "Run All Tests" to start comprehensive testing</p>
        </div>
      )}
    </div>
  );
};

export default TestRunner;